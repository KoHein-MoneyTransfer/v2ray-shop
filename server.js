document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const params = new URLSearchParams(window.location.search);
            const plan = decodeURIComponent(params.get('plan')) || 'မระบุ';
            const userType = params.get('user') === 'new' ? 'New User' : 'Old User (သက်တမ်းတိုး)';

            // Create a data object to send to our backend
            const orderData = {
                plan: plan,
                userType: userType,
                userName: document.getElementById('user-name').value,
                contactPhone: document.getElementById('contact-phone').value,
                paymentMethod: document.querySelector('input[name="payment"]:checked').value,
                senderName: document.getElementById('sender-name').value,
                txnId: document.getElementById('txn-id').value,
                note: document.getElementById('note').value || 'မရှိပါ'
            };

            const submitButton = form.querySelector('.submit-button');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Send data to OUR OWN backend server, not Telegram
            fetch('/api/submit-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('သင်၏ Order ကိုအောင်မြင်စွာလက်ခံရရှိပါသည်။ မကြာမီဆက်သွယ်ပေးပါမည်။');
                    form.reset();
                    document.getElementById('wave').dispatchEvent(new Event('change'));
                } else {
                    alert('Error ဖြစ်နေပါသည်။ နောက်တစ်ကြိမ် ထပ်ကြိုးစားပေးပါ။ Error: ' + (result.message || 'Unknown'));
                }
            })
            .catch(error => {
                alert('Network Error ဖြစ်နေပါသည်။ Internet ချိတ်ဆက်မှုကိုစစ်ဆေးပြီး နောက်တစ်ကြိမ်ထပ်ကြိုးစားပါ။');
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Confirm';
            });
        });
    }
});
