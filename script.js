window.onload = function () {
    updateTable();
};

function updateTable() {
    const month = document.getElementById('monthSelect').value;
    const daysInMonth = new Date(2024, month, 0).getDate(); // Número de dias do mês
    const tableBody = document.getElementById('timeSheetBody');
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

function toggleHoliday(checkbox) {
    const row = checkbox.parentElement.parentElement;
    row.classList.toggle('holiday-row', checkbox.checked);
    calculateHours(row.querySelector('input[type="time"]'));
}

function markDayOff() {
    const selectedRow = prompt("Digite o número do dia para marcar como folga (1 a 31):");
    const tableBody = document.getElementById('timeSheetBody');
    const rows = Array.from(tableBody.getElementsByTagName('tr'));

    if (selectedRow > 0 && selectedRow <= rows.length) {
        const row = rows[selectedRow - 1];
        row.classList.add('day-off-row');
        row.querySelectorAll('input[type="time"]').forEach(input => {
            input.value = '';
            input.disabled = true;
        });
        row.querySelector('.hours-worked').textContent = 'Folga';
        row.querySelector('.extra-hours').textContent = 'Folga';
        updateTotals();
    } else {
        alert("Número de dia inválido. Por favor, insira um valor entre 1 e 31.");
    }
}

function calculateHours(input) {
    const row = input.parentElement.parentElement;
    const [start, lunchStart, lunchEnd, end] = row.querySelectorAll('input[type="time"]');
    const workedHoursCell = row.querySelector('.hours-worked');
    const extraHoursCell = row.querySelector('.extra-hours');
    const isHoliday = row.querySelector('input[type="checkbox"]').checked;

    if (start.value && lunchStart.value && lunchEnd.value && end.value) {
        const startTime = new Date(`1970-01-01T${start.value}:00`);
        const lunchStartTime = new Date(`1970-01-01T${lunchStart.value}:00`);
        const lunchEndTime = new Date(`1970-01-01T${lunchEnd.value}:00`);
        const endTime = new Date(`1970-01-01T${end.value}:00`);

        const workBeforeLunch = (lunchStartTime - startTime) / 60000;
        const workAfterLunch = (endTime - lunchEndTime) / 60000;
        const totalMinutes = workBeforeLunch + workAfterLunch;
        const regularMinutes = 8 * 60;

        workedHoursCell.textContent = formatTime(totalMinutes);

        let overtimeMinutes = 0;
        if (isHoliday) {
            overtimeMinutes = totalMinutes; // Todas as horas são extras no feriado
        } else if (totalMinutes > regularMinutes) {
            overtimeMinutes = totalMinutes - regularMinutes;
        }

        extraHoursCell.textContent = formatTime(overtimeMinutes);
        updateTotals();
    } else {
        workedHoursCell.textContent = '00:00:00';
        extraHoursCell.textContent = '00:00:00';
        updateTotals();
    }
}

function updateTotals() {
    let totalWorkedMinutes = 0;
    let totalOvertimeMinutes = 0;

    document.querySelectorAll('.hours-worked').forEach(cell => {
        if (cell.textContent !== 'Folga') {
            totalWorkedMinutes += parseTime(cell.textContent);
        }
    });

    document.querySelectorAll('.extra-hours').forEach(cell => {
        if (cell.textContent !== 'Folga') {
            totalOvertimeMinutes += parseTime(cell.textContent);
        }
    });

    document.getElementById('totalWorked').textContent = formatTime(totalWorkedMinutes);
    document.getElementById('totalOvertime').textContent = formatTime(totalOvertimeMinutes);
    calculateEarnings();
}

function calculateEarnings() {
    const monthlySalary = parseFloat(document.getElementById('monthlySalary').value) || 0;
    const totalOvertimeMinutes = parseTime(document.getElementById('totalOvertime').textContent);
    const hourlyRate = monthlySalary / (22 * 8); // Considerando 22 dias úteis
    const overtimePay = (totalOvertimeMinutes / 60) * hourlyRate * 1.5;
    const totalEarnings = monthlySalary + overtimePay;

    document.getElementById('totalEarnings').textContent = `R$ ${totalEarnings.toFixed(2)}`;
}

function parseTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${padZero(hours)}:${padZero(mins)}:00`;
}

function padZero(value) {
    return value < 10 ? '0' + value : value;
}

function exportToCSV() {
    const table = document.getElementById('timeSheet');
    const rows = Array.from(table.rows);
    const csvContent = rows.map(row => {
        const cells = Array.from(row.cells).map(cell => {
            return `"${cell.textContent.trim().replace(/"/g, '""')}"`;
        }).join(",");
        return cells;
    }).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registro_ponto.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split("\n");
        console.log(lines); // Aqui você pode implementar o preenchimento baseado no CSV.
    };
    reader.readAsText(file);
}
