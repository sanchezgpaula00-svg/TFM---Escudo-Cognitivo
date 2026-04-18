// 🎨 MÓDULO DE INTERFAZ (TEA-Friendly)
const UIManager = {
    aplicarBloqueo: function() {
        if (document.getElementById("bloqueo-cognitivo-paula")) return;
        
        const bloqueo = document.createElement("div");
        bloqueo.id = "bloqueo-cognitivo-paula";
        Object.assign(bloqueo.style, {
            position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.6)", backdropFilter: "blur(5px)",
            zIndex: "2147483646", cursor: "not-allowed"
        });
        document.body.appendChild(bloqueo);
    },

    quitarBloqueo: function() {
        const bloqueo = document.getElementById("bloqueo-cognitivo-paula");
        if (bloqueo) bloqueo.remove();
    },

    inyectarBanner: function(mensaje, scores) {
        const previo = document.getElementById("banner-seguridad");
        if (previo) previo.remove();

        const banner = document.createElement("div");
        banner.id = "banner-seguridad";
        Object.assign(banner.style, {
            position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
            width: "90%", maxWidth: "800px", backgroundColor: "#E3F2FD",
            border: "2px solid #1976D2", borderRadius: "15px", padding: "20px",
            zIndex: "2147483647", boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
            display: "flex", flexDirection: "column", gap: "10px",
            fontFamily: "'Segoe UI', sans-serif"
        });

        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 30px;">🛡️</span>
                <div style="flex-grow: 1;">
                    <strong style="color: #0D47A1; font-size: 18px;">Análisis de Seguridad Inclusiva</strong>
                    <p style="margin: 5px 0; color: #333;">${mensaje}</p>
                </div>
                <button id="cerrar-escudo" style="background: #1976D2; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Entendido, desbloquear
                </button>
            </div>
            <div style="display: flex; justify-content: space-around; background: white; padding: 10px; border-radius: 10px; border: 1px solid #BBDEFB;">
                ${this._crearIndicador("Prisa", scores.urgency)}
                ${this._crearIndicador("Amenaza", scores.coercion)}
                ${this._crearIndicador("Autoridad", scores.authority)}
            </div>
        `;

        document.body.appendChild(banner);
        document.getElementById("cerrar-escudo").onclick = () => {
            banner.remove();
            this.quitarBloqueo();
        };
    },

    _crearIndicador: function(nombre, valor) {
        const esAlto = valor > 5;
        return `
            <div style="text-align: center;">
                <div style="font-size: 12px; color: #666;">${nombre}</div>
                <div style="font-weight: bold;">${esAlto ? '⚠️ Alta' : '✅ Baja'}</div>
            </div>
        `;
    }
};