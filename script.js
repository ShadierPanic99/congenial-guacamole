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
        const regularMinutes = 8 * 60; // 8 horas em minutos

        // Formatar o tempo trabalhado
        const workedHours = formatTime(totalMinutes);
        workedHoursCell.textContent = workedHours;

        let overtimeMinutes = 0;
        if (totalMinutes > regularMinutes) {
            // Calcula horas extras normais (1.5x) ou feriado (2x)
            const overtimeRate = isHoliday ? 2 : 1.5;
            overtimeMinutes = (totalMinutes - regularMinutes) * overtimeRate;
            overtimeMinutes = Math.max(overtimeMinutes, 0); // Garante que o valor de horas extras não seja negativo
            const overtime = formatTime(overtimeMinutes);
            extraHoursCell.textContent = overtime;
        } else {
            extraHoursCell.textContent = '00:00:00';
        }

        updateTotals();
    } else {
        workedHoursCell.textContent = '00:00:00';
        extraHoursCell.textContent = '00:00:00';
        updateTotals();
    }
}
