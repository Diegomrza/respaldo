// Necesario para todos los modulos
#include <linux/module.h>

// Para usar el kern_info
#include <linux/kernel.h>

// header para los macros de inicializacion y limpieza
#include <linux/init.h>

// Para usar las funciones de procfs
#include <linux/proc_fs.h>

// Para usar las funciones de copia de datos entre espacio de usuario y espacio de kernel
#include <asm/uaccess.h>

// Para usar las funciones de seq_file
#include <linux/seq_file.h>

// Para usar las funciones de memoria
#include <linux/mm.h>

// Para usar la estructura sysinfo
#include <linux/sysinfo.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Creacion del modulo de RAM en Linux, Sistemas operativos 1 - 201901429");
MODULE_AUTHOR("Diego Robles");
MODULE_VERSION("1.0");

/*
Constuir un json con la informacion de la memoria RAM
{
    "total_ram": 0,
    "free_ram": 0,
    "used_ram": 0
    "percentage_used": 0
}
*/

static int escribir_archivo(struct seq_file *archivo, void *v)
{
    struct sysinfo info;

    // Variables para almacenar la informacion de la memoria
    long total_ram, free_ram, used_ram, percentage_used;

    // Obtenemos la informacion de la memoria
    si_meminfo(&info);

    // Convertimos la informacion de la memoria a MB
    total_ram = (info.totalram * info.mem_unit) / (1024 * 1024);

    // Calculamos la cantidad de memoria usada y el porcentaje de memoria usada
    free_ram = (info.freeram * info.mem_unit) / (1024 * 1024);
    used_ram = total_ram - free_ram;
    percentage_used = (used_ram * 100) / total_ram;

    // Escribimos la informacion en el archivo
    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\"total_ram\": %ld,\n", total_ram);
    seq_printf(archivo, "\"free_ram\": %ld,\n", free_ram);
    seq_printf(archivo, "\"used_ram\": %ld,\n", used_ram);
    seq_printf(archivo, "\"percentage_used\": %ld\n", percentage_used);
    seq_printf(archivo, "}\n");
    return 0;
}

// Funcion que se ejecuta cuando se le hace un cat al modulo
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

// Si su kernel es 5.6 o superior, use la siguiente estructura
static struct proc_ops operaciones = {
    .proc_open = al_abrir,
    .proc_read = seq_read};

static int _insert(void)
{
    proc_create("ram_201901429", 0, NULL, &operaciones);
    printk(KERN_INFO "Creado el archivo /proc/ram_201901429\n");
    return 0;
}

static void _delete(void)
{
    remove_proc_entry("ram_201901429", NULL);
    printk(KERN_INFO "Eliminado el archivo /proc/ram_201901429\n");
}

module_init(_insert);
module_exit(_delete);