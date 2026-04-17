// 🛡️ ESCUDO COGNITIVO - Módulo de Mitigación de Ingeniería Social
console.log("🛡️ Escudo Cognitivo Activo");

// 1. Diccionario de patrones de urgencia
const patronesRiesgo = [
    // --- Tácticas de Urgencia y Tiempo ---
    "urgente", "inmediatamente", "clic aquí", "antes de que caduque", 
    "última oportunidad", "solo hoy", "quedan pocas horas", "24 horas", 
    "expira", "cuenta atrás", "rápido", "no espere",

    // --- Tácticas de Miedo, Autoridad y Sanción ---
    "multa", "bloqueada", "suspensión", "verificar cuenta", "confirmar identidad", 
    "actividad sospechosa", "acceso no autorizado", "policía", "banco", 
    "seguridad social", "hacienda", "fiscal", "incidencia", "embargo",
    "deuda", "fraude", "alerta de seguridad",

    // --- Tácticas de Avaricia, Premios y Descuentos ---
    "premio", "ganador", "felicidades", "reembolso", "devolución", 
    "cobrar", "ingreso", "herencia", "lotería", "bono", "descuento", 
    "gratis", "tarjeta regalo", "has ganado", "iPhone gratis",

    // --- Tácticas de Curiosidad y Engaño ---
    "mira esto", "no te lo vas a creer", "fotos privadas", "vídeo exclusivo",
    "secreto", "factura", "pedido confirmado", "paquete retenido", 
    "mensajería", "rastreo", "ver detalles",

    // --- Tácticas de Empatía o Ayuda Falsa ---
    "ayúdeme", "donación urgente", "familia en problemas", "accidente", 
    "huérfano", "enfermedad"
];

// 2. Función para crear el Banner con diseño TEA-Friendly
function inyectarBanner(palabra) {
    if (document.getElementById("escudo-seguridad-paula")) return;

    const banner = document.createElement("div");
    banner.id = "escudo-seguridad-paula";
    
    // Estilos profesionales y suaves (Object.assign)
    Object.assign(banner.style, {
        position: "fixed", top: "0", left: "0", width: "100%", height: "auto",
        backgroundColor: "#B2EBF2", // Cian muy claro
        color: "#004D40", // Verde oscuro contraste alto
        padding: "15px 20px", textAlign: "center", zIndex: "2147483647",
        fontSize: "18px", fontWeight: "500", fontFamily: "sans-serif",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex",
        justifyContent: "center", alignItems: "center", gap: "15px",
        boxSizing: "border-box" // Asegura que el padding no desborde
    });

    // Creamos el mensaje dividiéndolo para aplicar un estilo suave a la palabra
    banner.innerHTML = `
        <span style="font-size: 24px;">🛡️</span>
        <span style="flex-grow: 1;"><strong>Aviso de calma:</strong> 
        He detectado que este sitio usa lenguaje de presión centrado en la palabra 
        <span style="background-color: #FFF59D; color: #333; padding: 2px 6px; border-radius: 4px; font-weight: 700;">
            ${palabra}
        </span>. 
        Tómate un respiro antes de decidir.</span>
        <button id="cerrar-escudo" style="margin-left:20px; cursor:pointer; background:none; border:1px solid #004D40; border-radius:4px; padding:2px 10px;">Entendido</button>
    `;

    document.documentElement.prepend(banner);

    // Botón de control del usuario
    document.getElementById("cerrar-escudo").onclick = () => banner.remove();
}
// 3. Función de escaneo de la página
function escanearPagina() {
    const cuerpo = document.body.innerText.toLowerCase();
    
    // Filtramos la lista para quedarnos solo con las que aparecen en la web
    const encontradas = patronesRiesgo.filter(palabra => cuerpo.includes(palabra));

    if (encontradas.length > 0) {
        console.warn("⚠️ Múltiples amenazas detectadas:", encontradas);
        
        // Convertimos la lista de palabras en etiquetas visuales
        const listaResaltada = encontradas.map(p => 
            `<span style="background-color: #FFF59D; color: #333; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin: 0 2px;">
                ${p}
            </span>`
        ).join(" "); // Las unimos con un espacio

        inyectarBanner(listaResaltada);
    }
}
// 4. Ejecución: Esperamos un poco a que la web cargue bien
setTimeout(escanearPagina, 1000);