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

        // Calcular o tempo trabalhado antes e depois do almoço
        const workBeforeLunch = (lunchStartTime - startTime) / 60000;
        const workAfterLunch = (endTime - lunchEndTime) / 60000;
        const totalMinutes = workBeforeLunch + workAfterLunch;

        // Jornada normal de 8 horas
        const regularMinutes = 8 * 60;

        // Calcular horas extras
        let overtimeMinutes = 0;
        if (totalMinutes > regularMinutes) {
            overtimeMinutes = totalMinutes - regularMinutes;
        }

        // Aplicar o multiplicador de horas extras (1.5x para horas normais ou 2x para feriados)
        if (isHoliday) {
            overtimeMinutes *= 2; // Se for feriado, o multiplicador é 2
        } else {
            overtimeMinutes *= 1.5; // Caso contrário, é 1.5
        }

        // Formatar as horas trabalhadas e as horas extras
        const workedHours = formatTime(totalMinutes);
        workedHoursCell.textContent = workedHours;

        // Formatar as horas extras
        const overtime = formatTime(overtimeMinutes);
        extraHoursCell.textContent = overtime;

        updateTotals();
    } else {
        workedHoursCell.textContent = '00:00:00';
        extraHoursCell.textContent = '00:00:00';
        updateTotals();
    }
}
