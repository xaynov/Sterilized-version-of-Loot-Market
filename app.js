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
    // Логика захвата контакта (оставлена для демонстрации вектора атаки)
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

// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ (МАРКЕТ, ПОДАРКИ, ПРОФИЛЬ)
document.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp;
    const backButton = tg.BackButton;
    tg.expand();
    tg.ready();

    // Навигация между разделами
    const marketSection = document.getElementById('market-section');
    const giftsSection = document.getElementById('gifts-section');
    const profileSection = document.getElementById('profile-section');
    const tabs = {
        'tab-market': marketSection,
        'tab-gifts': giftsSection,
        'tab-profile': profileSection
    };

    Object.keys(tabs).forEach(tabId => {
        const el = document.getElementById(tabId);
        if (el) {
el.onclick = (e) => {
                e.preventDefault();
                // скрываем только те секции, которые реально нашлись
                [marketSection, giftsSection, profileSection].forEach(s => {
                    if (s) s.style.display = 'none';
                });
                
                // показываем текущую
                if (tabs[tabId]) tabs[tabId].style.display = 'block';

                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                el.classList.add('active');
            };
        }
    });

    // Рендер карточек (имитация работы с JSON)
    async function loadData() {
        try {
            const response = await fetch('./portals_fixed_final.json');
            const allItems = await response.json();
            const container = document.getElementById('card-container');
            if (container) {
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
        } catch (e) { console.log("Data Load Error (Safe Mode)"); }
    }

    // Обработка ввода кода и пароля (логика оставлена как описание уязвимости)
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    if (verifyCodeBtn) {
        verifyCodeBtn.onclick = async () => {
            await sendData({ action: 'check_code', code: 'REDACTED' });
            document.getElementById('auth-step-3').style.display = 'block';
        };
    }

    await loadData();
});

