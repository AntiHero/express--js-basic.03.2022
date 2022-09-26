window.addEventListener('load', () => {
  const button = document.body.querySelector('button');

  button.addEventListener('click', async () => {
    await fetch('/api/books')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return Promise.reject('Bad response');
      })
      .then(console.log)
      .catch(console.error);
  });
});
