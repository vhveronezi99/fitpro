// ===== CARDIO ROUTES =====
let cardioHistoryPeriod = 'week';

function getCardioPeriodDateRange(period) {
    const today = new Date();
    let start = new Date(today);
    let label = 'Hoje';

    if (period === 'week') {
        const dayOfWeek = start.getDay();
        const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(start.getDate() - offsetToMonday);
        label = 'Semana';
    } else if (period === 'month') {
        start.setDate(1);
        label = 'MÍs';
    }

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        label
    };
}

function changeCardioPeriod(period, event) {
    cardioHistoryPeriod = period;
    document.querySelectorAll('.cardio-period-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    renderCardio();
}

async function addCardioSession() {
    const type = document.getElementById('cardioType').value;
    const time = document.getElementById('cardioTime').value;
    const distance = document.getElementById('cardioDistance').value;

    if (!time || !distance) {
        alert('Preencha Tempo e Dist√¢ncia!');
        return;
    }

    const timeNum = parseInt(time);
    const distanceNum = parseFloat(distance);

    if (isNaN(timeNum) || timeNum <= 0 || timeNum > 1440) {
        alert('Tempo deve ser entre 1 e 1440 minutos!');
        return;
    }

    if (isNaN(distanceNum) || distanceNum <= 0 || distanceNum > 100) {
        alert('Dist√¢ncia deve ser entre 0.1 e 100 km!');
        return;
    }

    try {
        const sessionData = {
            userId: '182c75d0-7244-4aef-a0a0-af09e589caf7', // Demo user ID
            type,
            time: timeNum,
            distance: distanceNum,
            pace: calculatePace(timeNum, distanceNum)
        };

        await cardioAPI.addCardioSession(sessionData);

        alert('‚úÖ Sess√£o de ' + type + ' registrada: ' + distanceNum.toFixed(1) + ' km em ' + timeNum + ' minutos!');
        await renderCardio();
        if (typeof updateDashboard === 'function') updateDashboard();

        // Clear form
        document.getElementById('cardioType').value = 'Corrida';
        document.getElementById('cardioTime').value = '';
        document.getElementById('cardioDistance').value = '';

    } catch (error) {
        console.error('Error adding cardio session:', error);
        alert('Erro ao registrar sess√£o de cardio');
    }
}

function calculatePace(minutes, distance) {
    if (distance === 0) return '0:00';
    const paceMinutes = minutes / distance;
    const mins = Math.floor(paceMinutes);
    const secs = Math.round((paceMinutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function renderCardio() {
    try {
        const cardioSessions = await cardioAPI.getCardioSessions();
        appData.cardio = cardioSessions.map(c => ({
            id: c.id,
            type: c.type,
            time: c.time,
            distance: parseFloat(c.distance),
            pace: parseFloat(c.pace),
            date: new Date(c.created_at).toISOString().split('T')[0],
            timestamp: c.created_at
        }));

        const { startDate, endDate, label } = getCardioPeriodDateRange(cardioHistoryPeriod);
        const periodCardio = appData.cardio.filter(c => c.date >= startDate && c.date <= endDate);

        const title = document.getElementById('cardioHistoryTitle');
        if (title) title.textContent = `HistÛrico de Sessıes (${label})`;

        const totalTime = periodCardio.reduce((sum, c) => sum + (parseFloat(c.time) || 0), 0);
        const totalDistance = periodCardio.reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0);
        const avgPace = calculatePace(totalTime, totalDistance);

        const totalCardioTimeEl = document.getElementById('totalCardioTime');
        if (totalCardioTimeEl) totalCardioTimeEl.textContent = totalTime.toFixed(0);

        const totalCardioDistanceEl = document.getElementById('totalCardioDistance');
        if (totalCardioDistanceEl) totalCardioDistanceEl.textContent = totalDistance.toFixed(1);

        const avgPaceEl = document.getElementById('avgPace');
        if (avgPaceEl) avgPaceEl.textContent = avgPace;

        const html = periodCardio.map(session => `
            <tr class="border-b border-gray-300 hover:bg-gray-100">
                <td class="py-3 px-4">${new Date(session.timestamp).toLocaleDateString('pt-BR')}</td>
                <td class="py-3 px-4">${session.type}</td>
                <td class="py-3 px-4">${session.time} min</td>
                <td class="py-3 px-4">${session.distance.toFixed(1)} km</td>
                <td class="py-3 px-4">${session.pace} /km</td>
            </tr>
        `).join('');

        const cardioTableBody = document.getElementById('cardioTableBody');
        if (cardioTableBody) {
            cardioTableBody.innerHTML = html || `<tr><td colspan="5" class="py-4 px-4 text-center text-gray-500">Nenhuma sess„o registrada na ${label.toLowerCase()}</td></tr>`;
        }

    } catch (error) {
        console.error('Error loading cardio sessions:', error);
        const cardioTableBody = document.getElementById('cardioTableBody');
        if (cardioTableBody) {
            cardioTableBody.innerHTML = '<tr><td colspan="5" class="py-4 px-4 text-center text-red-500">Erro ao carregar sessıes</td></tr>';
        }
    }
}



