document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const morningBtn = document.getElementById('morningBtn');
    const eveningBtn = document.getElementById('eveningBtn');
    const morningSection = document.getElementById('morningSection');
    const eveningSection = document.getElementById('eveningSection');
    const morningAdhkar = document.getElementById('morningAdhkar');
    const eveningAdhkar = document.getElementById('eveningAdhkar');

    // Function to create a dhikr card
    function createDhikrCard(dhikr) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300';
        
        const counterState = localStorage.getItem(`dhikr_${dhikr.text.substring(0, 20)}`) || '0';
        const currentCount = parseInt(counterState);
        
        card.innerHTML = `
            <div class="space-y-4">
                <div class="text-xl text-right leading-relaxed">${dhikr.text}</div>
                <div class="text-gray-600 text-sm text-right">${dhikr.reference}</div>
                <div class="flex justify-between items-center mt-4">
                    <div class="flex items-center space-x-2 rtl:space-x-reverse">
                        <button class="counter-btn bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition duration-300">
                            <span class="counter">${currentCount}</span>/${dhikr.count}
                        </button>
                        <button class="reset-btn text-red-500 hover:text-red-600" title="إعادة تعيين">
                            <i class="fas fa-redo"></i>
                        </button>
                    </div>
                    <button class="copy-btn text-gray-500 hover:text-gray-700" title="نسخ">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            </div>
        `;

        // Counter functionality
        const counterBtn = card.querySelector('.counter-btn');
        const counterDisplay = card.querySelector('.counter');
        
        counterBtn.addEventListener('click', () => {
            if (currentCount < dhikr.count) {
                const newCount = currentCount + 1;
                counterDisplay.textContent = newCount;
                localStorage.setItem(`dhikr_${dhikr.text.substring(0, 20)}`, newCount.toString());
                
                if (newCount === dhikr.count) {
                    counterBtn.classList.remove('bg-emerald-500', 'hover:bg-emerald-600');
                    counterBtn.classList.add('bg-gray-500', 'hover:bg-gray-600');
                }
            }
        });

        // Reset button functionality
        const resetBtn = card.querySelector('.reset-btn');
        resetBtn.addEventListener('click', () => {
            counterDisplay.textContent = '0';
            localStorage.setItem(`dhikr_${dhikr.text.substring(0, 20)}`, '0');
            counterBtn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
            counterBtn.classList.add('bg-emerald-500', 'hover:bg-emerald-600');
        });

        // Copy button functionality
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(dhikr.text);
                
                // Show temporary success message
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check text-emerald-500"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                }, 1500);
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        });

        return card;
    }

    // Function to render adhkar
    function renderAdhkar(type) {
        const container = type === 'morning' ? morningAdhkar : eveningAdhkar;
        container.innerHTML = ''; // Clear existing content
        
        adhkarData[type].forEach(dhikr => {
            const card = createDhikrCard(dhikr);
            container.appendChild(card);
        });
    }

    // Initialize both sections
    renderAdhkar('morning');
    renderAdhkar('evening');

    // Toggle between morning and evening sections
    morningBtn.addEventListener('click', () => {
        morningSection.classList.remove('hidden');
        eveningSection.classList.add('hidden');
        morningBtn.classList.add('bg-emerald-600');
        morningBtn.classList.remove('bg-emerald-500');
        eveningBtn.classList.add('bg-blue-500');
        eveningBtn.classList.remove('bg-blue-600');
    });

    eveningBtn.addEventListener('click', () => {
        eveningSection.classList.remove('hidden');
        morningSection.classList.add('hidden');
        eveningBtn.classList.add('bg-blue-600');
        eveningBtn.classList.remove('bg-blue-500');
        morningBtn.classList.add('bg-emerald-500');
        morningBtn.classList.remove('bg-emerald-600');
    });
});
