// ⚙️ CONFIGURACIÓN GLOBAL
const CONFIG = {
    URL_BACKEND: "http://localhost:8000/analyze",
    SITIOS_SEGUROS: [
        "google.com",
        "uclm.es",
        "wikipedia.org",
        "canvas.instructure.com",
        "outlook.office.com"
    ],
    MAX_CARACTERES: 2000,
    TIEMPO_ESPERA_CARGA: 1000
};

function esSitioSeguro() {
    return CONFIG.SITIOS_SEGUROS.some(url => window.location.hostname.includes(url));
}