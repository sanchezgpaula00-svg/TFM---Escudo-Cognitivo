// 🚀 DIRECTOR DE ORQUESTA
async function escanearPagina() {
    console.log("🛡️ Iniciando escaneo de seguridad...");

    if (esSitioSeguro()) {
        console.log("🛡️ Sitio de confianza detectado. Escudo en reposo.");
        return; 
    }

    const textoLimpio = PrivacyFilter.sanitizar(document.body.innerText.slice(0, CONFIG.MAX_CARACTERES));

    try {
        const respuesta = await fetch(CONFIG.URL_BACKEND, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: textoLimpio })
        });

        const resultado = await respuesta.json();
        const info = resultado.analisis_cognitivo;

        if (info.nivel !== "SEGURO") {
            UIManager.aplicarBloqueo();
            UIManager.inyectarBanner(info.nivel, resultado.ia_raw_scores);
        }
    } catch (e) {
        console.error("❌ Error de conexión con el backend de IA");
    }
}

// Lanzamos el proceso
setTimeout(escanearPagina, CONFIG.TIEMPO_ESPERA_CARGA);