function updateTable() {
    const monthSelect = document.getElementById('monthSelect');
    if (!monthSelect) {
        console.error("Elemento 'monthSelect' não encontrado.");
        return;
    }

    const month = parseInt(monthSelect.value, 10); // Garante que o valor é numérico
    if (isNaN(month) || month < 1 || month > 12) {
        console.error("Mês inválido selecionado.");
        return;
    }

    const daysInMonth = new Date(2024, month, 0).getDate(); // Número de dias do mês
    const tableBody = document.getElementById('timeSheetBody');
    if (!tableBody) {
        console.error("Elemento 'timeSheetBody' não encontrado.");
        return;
    }

    tableBody.innerHTML = ''; // Limpa a tabela

    for (let day = 1; day <= daysInMonth; day++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day}</td>
            <td><input type="checkbox" onchange="toggleHoliday(this)"></td>
            <td><input type="time" onchange="calculateHours(this)"></td>
            <td><input type="time" onchange="calculateHours(this)"></td>
            <td><input type="time" onchange="calculateHours(this)"></td>
            <td><input type="time" onchange="calculateHours(this)"></td>
            <td class="hours-worked">00:00:00</td>
            <td class="extra-hours">00:00:00</td>
        `;
        tableBody.appendChild(row);
    }
}
