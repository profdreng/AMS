// Cole isto na CONSOLA DO BROWSER (F12 > Console)
// para testar o PUT diretamente

const testEditFrontend = async () => {
    console.log("🔍 Teste de PUT do Frontend");
    
    // Objecto simulando uma ferramenta
    const tool = {
        id: 4,  // Usar ID 4 que sabemos que existe
        code: "MZI000015000500",
        description: "Teste Frontend 🚀",
        serial_number: "MZI0000150005",
        manufacture_date: "2026-03-17",
        technical_document: "/docs/test.pdf",
        active: true,
        tool_type_id: 1
    };
    
    console.log("Enviando para: tools/" + tool.id);
    console.log("Dados:", tool);
    
    try {
        const response = await fetch(`http://192.168.0.71:8001/tools/${tool.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tool_type_id: tool.tool_type_id,
                code: tool.code,
                description: tool.description,
                serial_number: tool.serial_number,
                manufacture_date: tool.manufacture_date,
                technical_document: tool.technical_document,
                active: tool.active
            })
        });
        
        console.log("Status:", response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log("✅ SUCESSO!");
            console.log(result);
        } else {
            const error = await response.text();
            console.error("❌ Erro:", error);
        }
    } catch (err) {
        console.error("❌ Erro de rede:", err.message);
    }
};

// Executar
testEditFrontend();
