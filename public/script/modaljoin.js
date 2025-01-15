
<script>
// Jquery to handle the modal show event
$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var tourCode = button.data('tour'); // Extract info from data-* attributes
  var modal = $(this);
  modal.find('.modal-body #tour').val(tourCode);
});

// Handle form submission
document.getElementById('saveChangesBtn').addEventListener('click', function() {
  var form = document.getElementById('tourForm');
  if (form.checkValidity()) {
    // You can add your form submission logic here
    alert('Form submitted successfully!');
    form.submit();
  } else {
    form.reportValidity();
  }
});
</script>
