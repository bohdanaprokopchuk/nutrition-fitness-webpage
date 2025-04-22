function setupBmiForm() {
    const bmiForm = document.getElementById("bmiForm");
    
    if (!bmiForm) {
        console.log("Форма BMI не знайдена на сторінці");
        return;
    }

    bmiForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const height = parseFloat(document.getElementById("height").value) / 100;
        const weight = parseFloat(document.getElementById("weight").value);
        
        if (!height || !weight || height <= 0 || weight <= 0) {
            alert("Будь ласка, введіть коректні дані!");
            return;
        }
        
        const bmi = (weight / (height * height)).toFixed(1);
        const resultElement = document.getElementById("result");
        const adviceElement = document.getElementById("advice");
        
        let category = "";
        let trainingAdvice = "";
        let nutritionAdvice = "";
        
        // Визначені категорії ІМТ
        if (bmi < 18.5) {
            category = "Недостатня вага";
            trainingAdvice = "Рекомендовано: силові тренування для набору м'язової маси, плавання, йога.";
            nutritionAdvice = "Харчування: збагачена білками та вуглеводами дієта (курка, яйця, горіхи, крупи).";
        } else if (bmi >= 18.5 && bmi < 25) {
            category = "Нормальна вага";
            trainingAdvice = "Рекомендовано: кардіо (біг, велоспорт), силові тренування, функціональні вправи.";
            nutritionAdvice = "Харчування: збалансоване (овочі, фрукти, білки, повільні вуглеводи).";
        } else if (bmi >= 25 && bmi < 30) {
            category = "Надмірна вага";
            trainingAdvice = "Рекомендовано: інтервальні тренування, ходьба, плавання.";
            nutritionAdvice = "Харчування: зменшення споживання швидких вуглеводів, більше овочів та білків.";
        } else {
            category = "Ожиріння";
            trainingAdvice = "Рекомендовано: легкі кардіонавантаження (ходьба, аквааеробіка), консультація лікаря.";
            nutritionAdvice = "Харчування: низькокалорійна дієта під контролем дієтолога.";
        }
        
        // Вивід результату з перевіркою елементів
        if (resultElement) {
            resultElement.innerHTML = `
                <h3>Ваш ІМТ: <strong>${bmi}</strong></h3>
                <p>Категорія: <strong>${category}</strong></p>
                <h5>Обрати программу</h5>
                <a href="/programs" class="btn btn-sm btn-outline-primary">Тренування</a>
                <a href="/plans" class="btn btn-sm btn-outline-primary">Харчування</a>
            `;
        }
        
        if (adviceElement) {
            adviceElement.innerHTML = `
                <h4>Рекомендації:</h4>
                <p><strong>Тренування:</strong> ${trainingAdvice}</p>
                <p><strong>Харчування:</strong> ${nutritionAdvice}</p>
            `;
        }
    });
};

document.addEventListener("DOMContentLoaded", function() {
    setupBmiForm();
});

// Функція для виведення збережених результатів 
function displaySavedResults() {
    const savedResults = JSON.parse(localStorage.getItem('bmiResults')) || [];
    if (savedResults.length > 0) {
        console.log("Історія розрахунків ІМТ:", savedResults);
    }
}

// Оптимізована обробка скролу для навбара
function handleNavbarScroll() {
    const navbar = document.querySelector('.action-navbar');
    if (!navbar) return;

    const shouldScroll = window.scrollY > 150;
    const wasScrolled = navbar.classList.contains('navbar-scrolled');

    if (shouldScroll !== wasScrolled) {
        navbar.classList.toggle('navbar-scrolled', shouldScroll);
    }
}

let isScrolling;
window.addEventListener('scroll', function() {
    window.cancelAnimationFrame(isScrolling);
    isScrolling = window.requestAnimationFrame(handleNavbarScroll);
});

// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', function() {
    // Функція для збереження плану
    async function savePlan(planType, planData) {
        if (!planData || Object.keys(planData).length === 0) {
            showAlert('warning', `Немає даних для збереження ${planType === 'exercise' ? 'тренувань' : 'харчування'}`);
            return;
        }

        try {
            const response = await fetch(`/api/save-${planType}-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ planData }),
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                showAlert('success', `План ${planType === 'exercise' ? 'тренувань' : 'харчування'} успішно збережено!`);
            } else {
                showAlert('danger', result.message || 'Сталася помилка при збереженні');
            }
        } catch (error) {
            console.error('Помилка при збереженні плану:', error);
            showAlert('danger', 'Не вдалося зберегти план. Спробуйте ще раз.');
        }
    }

    // Функція для отримання даних з localStorage
    function getPlanData(planType) {
        try {
            const data = localStorage.getItem(`user${planType === 'exercise' ? 'Exercise' : 'Meal'}Plan`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Помилка при читанні даних з localStorage:', e);
            return null;
        }
    }

    // Обробники кнопок
    const saveExerciseBtn = document.getElementById('saveplant');
    const saveDietBtn = document.getElementById('savepland');

    if (saveExerciseBtn) {
        saveExerciseBtn.addEventListener('click', function() {
            const planData = getPlanData('exercise');
            if (planData) {
                savePlan('exercise', planData);
            } else {
                showAlert('warning', 'Немає даних плану тренувань для збереження');
            }
        });
    }

    if (saveDietBtn) {
        saveDietBtn.addEventListener('click', function() {
            const planData = getPlanData('diet');
            if (planData) {
                savePlan('diet', planData);
            } else {
                showAlert('warning', 'Немає даних плану харчування для збереження');
            }
        });
    }

    // Обробник для мобільного меню
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('#ftco-nav');

    if (toggler && collapse) {
        toggler.addEventListener('click', function() {
            collapse.classList.toggle('show');
            const isExpanded = collapse.classList.contains('show');
            toggler.setAttribute('aria-expanded', isExpanded);
        });
    }
});
    // Функція для показу спливаючих вікон
    function showAlert(type, message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-3`;
        alertDiv.style.maxWidth = '500px';
        alertDiv.style.zIndex = '1100';
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 3000);
    };


// Викликаємо при загрузці сторінки
window.addEventListener('load', displaySavedResults);