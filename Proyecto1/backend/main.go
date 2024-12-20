package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"time"
	"bytes"
	"io/ioutil"
	"net"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/shirou/gopsutil/cpu"
)

type Process struct {
	Pid    int     `json:"pid"`
	Name   string  `json:"name"`
	User   int     `json:"user"`
	State  int     `json:"state"`
	Ram    float64 `json:"ram"`
	Father int     `json:"father"`
}

type Cpu struct {
	Usage     float64   `json:"percentage_used"`
	Processes []Process `json:"tasks"`
	Ip        string    `json:"ip"`  // Agregar el campo IP
}

type Ram struct {
	Total float64 `json:"total_ram"`
	Free  float64 `json:"free_ram"`
	Used  float64 `json:"used_ram"`
	Perc  float64 `json:"percentage_used"`
	Ip    string  `json:"ip"`  // Agregar el campo IP
}

type Ip struct {
	Ip string `json:"ip"`
}

// Index
func Index(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome!")
}

// postScheduledData
func postScheduledData() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// Obtener la IP de la máquina que ejecuta la app
			ip, err := getLocalIP()
			if err != nil {
				fmt.Println("Error al obtener la IP local:", err)
				continue
			}

			// fmt.Println("======= DATOS MODULO CPU =======")
			// fmt.Println(" ")

			cmdCpu := exec.Command("sh", "-c", "cat /proc/cpu_201901429")
			outCpu, errCpu := cmdCpu.CombinedOutput()
			if errCpu != nil {
				fmt.Println(errCpu) // Imprimir el error
			}

			// ---CPU
			// fmt.Println("======= CPU =======")
			var cpu_info Cpu
			err = json.Unmarshal([]byte(outCpu), &cpu_info)
			if err != nil {
				fmt.Println(err) // Imprimir el error
			}

			// Agregar la IP al json
			cpu_info.Ip = ip  // Añadir la IP a la estructura de datos

			//Mandar el post
			// url := "http://nodejs-container:8000/cpu"
			url := "http://34.60.2.190:8000/cpu"
			// fmt.Println(url)

			//Manda cpu_info que es un json
			p_cpu, err := cpu.Percent(time.Second, false)
			if err != nil {
				fmt.Println(err) // Imprimir el error
			}
			cpu_info.Usage = p_cpu[0]
			jsonValue, _ := json.Marshal(cpu_info)

			// fmt.Println("Esto es lo que se manda")
			// fmt.Println(string(jsonValue))

			// ? Mandar el json a la url CPU
			response, err := http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
			if err != nil {
				fmt.Println(err) // Imprimir el error
			} else {
				defer response.Body.Close()
				responseBody, err := ioutil.ReadAll(response.Body)
				if err != nil {
					fmt.Println("Es este el error") // Imprimir el error
					fmt.Println(err) // Imprimir el error
				} else {
					fmt.Println("\x1b[32m", string(responseBody), "\x1b[0m")
				}
			}

			// fmt.Println(" ")
			// mt.Println("======= DATOS MODULO RAM =======")
			// fmt.Println(" ")

			cmdRam := exec.Command("sh", "-c", "cat /proc/ram_201901429")
			outRam, errRam := cmdRam.CombinedOutput()
			if errRam != nil {
				fmt.Println(errRam) // Imprimir el error
			}
			// ---RAM
			// fmt.Println("======= RAM =======")
			var ram_info Ram
			err = json.Unmarshal([]byte(outRam), &ram_info)
			if err != nil {
				fmt.Println(err) // Imprimir el error
			}

			// Agregar la IP al json
			ram_info.Ip = ip  // Añadir la IP a la estructura de datos

			// Mandar respuesta
			// url = "http://nodejs-container:8000/ram"
			url = "http://34.60.2.190:8000/ram"
			// fmt.Println(url)

			// Manda ram_info que es un json
			jsonValue, _ = json.Marshal(ram_info)

			// fmt.Println("Esto es lo que se manda")
			// fmt.Println(string(jsonValue))

			// ? Mandar el json a la url RAM
			response, err = http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
			if err != nil {
				fmt.Println(err) // Imprimir el error
			} else {
				defer response.Body.Close()
				responseBody, err := ioutil.ReadAll(response.Body)
				if err != nil {
					fmt.Println("Es este el error") // Imprimir el error
					fmt.Println(err) // Imprimir el error
				} else {
					fmt.Println("\x1b[32m", string(responseBody), "\x1b[0m")
				}
			}

			// fmt.Println(" ")
		}
	}
}

/// Función para obtener la IP local
func getLocalIP() (string, error) {
	// Obtener las interfaces de red
	interfaces, err := net.Interfaces()
	if err != nil {
		return "", err
	}

	for _, iface := range interfaces {
		// Filtrar interfaces que no están en loopback y son de tipo IPv4
		if iface.Flags&net.FlagUp != 0 && iface.HardwareAddr.String() != "" {
			addrs, err := iface.Addrs()
			if err != nil {
				return "", err
			}
			for _, addr := range addrs {
				// Verificar si es una dirección IPv4 y no es loopback
				if ipNet, ok := addr.(*net.IPNet); ok && !ipNet.IP.IsLoopback() && ipNet.IP.To4() != nil {
					return ipNet.IP.String(), nil
				}
			}
		}
	}
	return "", fmt.Errorf("No se pudo encontrar una IP válida")
}

func main() {

	fmt.Println("Starting server... - Sistemas Operativos 1")
	router := mux.NewRouter().StrictSlash(true)
	//Endpoints
	router.HandleFunc("/", Index).Methods("GET")

	//Iniciar go routine
	go postScheduledData()

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	//Start server
	fmt.Println("Server started at port 5200")
	log.Fatal(http.ListenAndServe(":5200", handlers.CORS(headers, methods, origins)(router)))
}