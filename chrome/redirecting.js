const params = new URLSearchParams(window.location.search);
const target = params.get('to');
if (target) {
  setTimeout(() => {
    window.location.href = target;
  }, 2000);
}
