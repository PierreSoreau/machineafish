const buttons = document.querySelectorAll('.filter-btn');

buttons.forEach(button => {      

    button.addEventListener('click', () => {

        buttons.forEach(btn => {
           btn.classList.remove('active');
        });

        button.classList.add('active')

        const filter = button.getAttribute('data-filter');
        const cards = document.querySelectorAll('.tuto-card');


        cards.forEach(card => {
            if (card.getAttribute('data-category') === filter || filter === 'all') {
                card.style.display = 'block';
            }

            else {
                card.style.display = 'none';
            }
        });
    });

});