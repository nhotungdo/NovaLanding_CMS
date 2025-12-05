// Lead Form Submission Handler
// Include this script in form templates to handle lead submission

function initLeadForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const pageSlug = window.location.pathname.split('/').pop();
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const response = await fetch(`/api/lead/submit/${pageSlug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ formData: data })
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                form.innerHTML = `
                    <div class="alert alert-success">
                        <h4>Thank You!</h4>
                        <p>${result.message}</p>
                    </div>
                `;
            } else {
                alert(result.message || 'Failed to submit form');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// Auto-initialize forms with class 'lead-form'
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lead-form').forEach(form => {
        initLeadForm(form.id);
    });
});
