// Inicio del contenido para calculadora-energia.js (VERSIÓN DE PRUEBA SIMPLIFICADA)

const commonAppliancesData = {
    "Bombillo LED (10W)": 10,
    "Bombillo Incandescente (60W)": 60,
    "Refrigerador (Eficiente, clase A)": 150,
    "Congelador Pequeño": 100,
    "Aire Acondicionado (Ventana, 1 Ton)": 1200,
    "Aire Acondicionado (Split, 1 Ton, Inverter)": 900,
    "Ventilador de Techo/Pie": 75,
    "TV LED (42 pulgadas)": 80,
    "Computadora de Escritorio + Monitor": 250,
    "Laptop": 60,
    "Cargador de Celular": 10,
    "Microondas": 1100,
    "Estufa Eléctrica (1 hornilla encendida)": 1500,
    "Lavadora (por ciclo de 1 hora)": 500,
    "Bomba de Agua (1/2 HP)": 375,
};

let addedAppliances = [];
let nextId = 0;

function addAppliance() {
    console.log("Función addAppliance llamada.");
    const name = document.getElementById('applianceName').value.trim();
    const power = parseFloat(document.getElementById('appliancePower').value);
    const quantity = parseInt(document.getElementById('applianceQuantity').value);
    const hours = parseFloat(document.getElementById('applianceHours').value);

    console.log("Datos leídos:", { name, power, quantity, hours });

    if (!name) {
        alert("Por favor, ingrese el nombre del aparato.");
        return;
    }
    if (isNaN(power) || power <= 0) {
        alert("Por favor, ingrese una potencia válida (mayor a 0 Watts).");
        console.error("Error de potencia:", power);
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        alert("Por favor, ingrese una cantidad válida (mayor o igual a 1).");
        console.error("Error de cantidad:", quantity);
        return;
    }
    if (isNaN(hours) || hours < 0 || hours > 24) {
        alert("Por favor, ingrese horas de uso válidas (entre 0 y 24).");
        console.error("Error de horas:", hours);
        return;
    }

    const dailyKWh = (power * quantity * hours) / 1000;
    const totalPowerForThisApplianceType = power * quantity; 
    console.log("Calculado para aparato:", { dailyKWh, totalPowerForThisApplianceType });

    addedAppliances.push({ id: nextId++, name, power, quantity, hours, dailyKWh, totalPowerForThisApplianceType });
    
    renderAppliancesList();
    updateTotalDailyConsumption();
    clearApplianceInputs();
    console.log("Aparato añadido, lista de aparatos:", addedAppliances);
}

function removeAppliance(id) {
    console.log("Función removeAppliance llamada para id:", id);
    addedAppliances = addedAppliances.filter(app => app.id !== id);
    renderAppliancesList();
    updateTotalDailyConsumption();
}

function renderAppliancesList() {
    console.log("Función renderAppliancesList llamada.");
    const listElement = document.getElementById('appliancesList');
    if (!listElement) {
        console.error("Elemento 'appliancesList' no encontrado en renderAppliancesList.");
        return;
    }
    listElement.innerHTML = ''; 

    addedAppliances.forEach(app => {
        const row = listElement.insertRow();
        row.insertCell().textContent = app.name;
        row.insertCell().textContent = app.power.toFixed(0);
        row.insertCell().textContent = app.quantity;
        row.insertCell().textContent = app.hours.toFixed(1);
        row.insertCell().textContent = app.dailyKWh.toFixed(3);
        
        const actionCell = row.insertCell();
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.classList.add('remove-btn');
        removeButton.onclick = () => removeAppliance(app.id);
        actionCell.appendChild(removeButton);
    });
}

function updateTotalDailyConsumption() {
    console.log("Función updateTotalDailyConsumption llamada.");
    const total = addedAppliances.reduce((sum, app) => sum + app.dailyKWh, 0);
    const totalElement = document.getElementById('totalDailyConsumption');
    if (totalElement) {
        totalElement.textContent = total.toFixed(3);
    } else {
        console.error("Elemento 'totalDailyConsumption' no encontrado.");
    }
}

function clearApplianceInputs() {
    console.log("Función clearApplianceInputs llamada.");
    const commonApplianceEl = document.getElementById('commonAppliance');
    if (commonApplianceEl) commonApplianceEl.value = "";
    
    const applianceNameEl = document.getElementById('applianceName');
    if (applianceNameEl) applianceNameEl.value = "";

    const appliancePowerEl = document.getElementById('appliancePower');
    if (appliancePowerEl) appliancePowerEl.value = "";
    
    const applianceHoursEl = document.getElementById('applianceHours');
    if (applianceHoursEl) applianceHoursEl.value = "";
    
    if (applianceNameEl) applianceNameEl.focus();
}

function calculateSystemSize() {
    console.log("Función calculateSystemSize llamada.");
    console.log("Estado actual de addedAppliances:", addedAppliances);

    const totalDailyKWh = addedAppliances.reduce((sum, app) => sum + app.dailyKWh, 0);
    const autonomyDesiredHoursInput = document.getElementById('autonomyHours');
    const peakSunHoursInput = document.getElementById('peakSunHours');

    if (!autonomyDesiredHoursInput || !peakSunHoursInput) {
        console.error("Elementos 'autonomyHours' o 'peakSunHours' no encontrados.");
        return;
    }

    const autonomyDesiredHours = parseFloat(autonomyDesiredHoursInput.value);
    const peakSunHours = parseFloat(peakSunHoursInput.value);
    console.log("Valores de entrada para cálculo:", { totalDailyKWh, autonomyDesiredHours, peakSunHours });


    if (addedAppliances.length === 0) {
        alert("Añada al menos un aparato antes de calcular el sistema.");
        return;
    }

    if (isNaN(autonomyDesiredHours) || autonomyDesiredHours <= 0) {
        alert("Por favor, ingrese horas de autonomía válidas.");
        return;
    }
    if (isNaN(peakSunHours) || peakSunHours <= 0) {
        alert("Por favor, ingrese Horas Solares Pico válidas. Este valor debe ser mayor que cero.");
        return;
    }

    // Cálculos de paneles y batería (se mantienen)
    const systemLossFactor = 1.25; 
    const solarPanelKWp = (totalDailyKWh > 0 ? (totalDailyKWh / peakSunHours) * systemLossFactor : 0);
    const energyForAutonomy = (totalDailyKWh / 24) * autonomyDesiredHours;
    const batteryDod = 0.8; 
    const batteryRoundtripEfficiency = 0.90; 
    const batteryCapacityKWh = (totalDailyKWh > 0 ? energyForAutonomy / (batteryDod * batteryRoundtripEfficiency) : 0);

    // -------- PRUEBA PARA EL INVERSOR: VALOR FIJO --------
    const suggestedInverterWatts = 9999; // ¡¡VALOR FIJO PARA PRUEBA!!
    console.log("PRUEBA: suggestedInverterWatts establecido a un valor fijo:", suggestedInverterWatts);
    // ------------------------------------------------------

    // Mostrar resultados
    console.log("Intentando mostrar resultados...");
    const resultsSectionEl = document.getElementById('resultsSection');
    const resultDailyKWhEl = document.getElementById('resultDailyKWh');
    const resultSolarPanelKWpEl = document.getElementById('resultSolarPanelKWp');
    const resultAutonomyHoursEl = document.getElementById('resultAutonomyHours');
    const resultBatteryKWhEl = document.getElementById('resultBatteryKWh');
    const resultInverterWattsEl = document.getElementById('resultInverterWatts');

    if (!resultsSectionEl || !resultDailyKWhEl || !resultSolarPanelKWpEl || !resultAutonomyHoursEl || !resultBatteryKWhEl || !resultInverterWattsEl) {
        console.error("Error: Uno o más elementos de la sección de resultados no fueron encontrados.");
        // Imprimir el estado de cada uno para saber cuál falta
        console.log({resultsSectionEl, resultDailyKWhEl, resultSolarPanelKWpEl, resultAutonomyHoursEl, resultBatteryKWhEl, resultInverterWattsEl});
        return;
    }
    
    resultsSectionEl.style.display = 'block';
    resultDailyKWhEl.textContent = totalDailyKWh.toFixed(3);
    resultSolarPanelKWpEl.textContent = solarPanelKWp.toFixed(2);
    resultAutonomyHoursEl.textContent = autonomyDesiredHours.toFixed(0);
    resultBatteryKWhEl.textContent = batteryCapacityKWh.toFixed(2);
    
    console.log("Asignando valor al inversor:", suggestedInverterWatts);
    resultInverterWattsEl.textContent = suggestedInverterWatts.toFixed(0); // Se mostrará "9999"
    
    resultsSectionEl.scrollIntoView({ behavior: 'smooth' });
    console.log("Cálculo y muestra de resultados completados.");
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado y parseado.");
    const commonApplianceSelect = document.getElementById('commonAppliance');
    if (commonApplianceSelect) { 
        console.log("Elemento 'commonAppliance' encontrado, poblando opciones.");
        for (const name in commonAppliancesData) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            commonApplianceSelect.appendChild(option);
        }

        commonApplianceSelect.addEventListener('change', function() {
            console.log("Cambio en 'commonAppliance', valor:", this.value);
            const selectedName = this.value;
            const applianceNameInput = document.getElementById('applianceName');
            const appliancePowerInput = document.getElementById('appliancePower');

            if (selectedName && commonAppliancesData[selectedName]) {
                if (applianceNameInput) applianceNameInput.value = selectedName;
                if (appliancePowerInput) appliancePowerInput.value = commonAppliancesData[selectedName];
            } else {
                if (applianceNameInput) applianceNameInput.value = '';
                if (appliancePowerInput) appliancePowerInput.value = '';
            }
        });
    } else {
        console.error("Elemento 'commonAppliance' NO encontrado en DOMContentLoaded.");
    }
    // Estas funciones se llaman para asegurar que la tabla esté vacía inicialmente
    // y el total en 0.00, pero no deberían causar problemas.
    renderAppliancesList(); 
    updateTotalDailyConsumption();
    console.log("Inicialización de la calculadora completada.");
});

console.log("Archivo calculadora-energia.js (VERSIÓN DE PRUEBA SIMPLIFICADA) cargado.");

// Fin del contenido para calculadora-energia.js