document.addEventListener('DOMContentLoaded', function() {
    console.log('Product Store is ready!');
    
    // Пример: Уведомление при удалении товара
    const deleteButtons = document.querySelectorAll('form button[type="submit"]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            if (!confirm('Are you sure you want to delete this product?')) {
                event.preventDefault();
            }
        });
    });
});
