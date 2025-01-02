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

        const workBeforeLunch = (lunchStartTime - startTime) / 60000; // Minutos antes do almoço
        const workAfterLunch = (endTime - lunchEndTime) / 60000; // Minutos após o almoço
        const totalMinutes = workBeforeLunch + workAfterLunch; // Total de minutos trabalhados
        const regularMinutes = 8 * 60; // Jornada padrão de 8 horas (em minutos)

        workedHoursCell.textContent = formatTime(totalMinutes); // Total de horas trabalhadas

        let overtimeMinutes = 0;
        if (isHoliday) {
            overtimeMinutes = totalMinutes; // Todas as horas são extras em feriados
        } else if (totalMinutes > regularMinutes) {
            overtimeMinutes = totalMinutes - regularMinutes; // Apenas o excedente é extra
        }

        extraHoursCell.textContent = formatTime(overtimeMinutes); // Horas extras
        updateTotals(); // Atualiza os totais da tabela
    } else {
        workedHoursCell.textContent = '00:00:00';
        extraHoursCell.textContent = '00:00:00';
        updateTotals();
    }
}
