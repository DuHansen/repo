
      
              
                         
                                document.addEventListener('DOMContentLoaded', () => {
                                    const apiKey = 'AIzaSyAPPJuCO2pdpY5qn19Cc4KMxKrbsKyI5Us'; // Substitua pela sua chave de API
                                    let query = 'programming'; // Valor padrão inicial da pesquisa
                                    let startIndex = 0;
                                    const maxResults = 10;
                                    const booksDiv = document.getElementById('books');
                                    const loadingDiv = document.getElementById('loading');
                                    const loaderDiv = document.getElementById('loader');
                                    const searchInput = document.getElementById('search-query');
                                    const searchButton = document.getElementById('search-button');
                                  
                                    async function fetchBooks(startIndex) {
                                      try {
                                        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`;
                                  
                                        const response = await fetch(url);
                                  
                                        if (!response.ok) {
                                          throw new Error('Erro ao buscar livros.');
                                        }
                                  
                                        const data = await response.json();
                                        displayBooks(data.items);
                                  
                                        if (data.items.length < maxResults) {
                                          window.removeEventListener('scroll', handleScroll); // Remove o listener quando não há mais livros para carregar
                                        }
                                      } catch (error) {
                                        console.error('Erro ao buscar livros:', error);
                                      } finally {
                                        loaderDiv.classList.add('hidden');
                                        loadingDiv.classList.add('hidden');
                                      }
                                    }
                                  
                                    function displayBooks(books) {
                                      if (!books || books.length === 0) {
                                        console.error('Nenhum livro encontrado.');
                                        return;
                                      }
                                  
                                      books.forEach(b => {
                                        const bookDiv = document.createElement('div');
                                        bookDiv.classList.add('bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'w-64', 'text-center', 'flex', 'flex-col', 'items-center', 'gap-2');
                                  
                                        const title = document.createElement('h2');
                                        title.textContent = b.volumeInfo.title;
                                        title.classList.add('text-xl', 'font-semibold', 'mb-2');
                                        bookDiv.appendChild(title);
                                  
                                        if (b.volumeInfo.imageLinks && b.volumeInfo.imageLinks.thumbnail) {
                                          const img = document.createElement('img');
                                          img.src = b.volumeInfo.imageLinks.thumbnail;
                                          img.alt = `Capa do livro: ${b.volumeInfo.title}`;
                                          img.classList.add('w-full', 'h-48', 'object-cover', 'mb-2');
                                          bookDiv.appendChild(img);
                                        }
                                  
                                        const author = document.createElement('p');
                                        author.textContent = `Autor: ${b.volumeInfo.authors ? b.volumeInfo.authors.join(', ') : 'Desconhecido'}`;
                                        author.classList.add('text-gray-700', 'mb-2');
                                        bookDiv.appendChild(author);
                                  
                                        const description = document.createElement('p');
                                        description.classList.add('text-gray-600', 'text-sm', 'mb-2');
                                        if (b.volumeInfo.description && b.volumeInfo.description.length > 100) {
                                          description.textContent = b.volumeInfo.description.substring(0, 100) + '... ';
                                          const moreLink = document.createElement('a');
                                          moreLink.textContent = 'Saber mais';
                                          moreLink.classList.add('text-blue-500', 'cursor-pointer');
                                          moreLink.onclick = () => {
                                            description.textContent = b.volumeInfo.description;
                                            moreLink.remove();
                                          };
                                          description.appendChild(moreLink);
                                        } else {
                                          description.textContent = b.volumeInfo.description || 'Sem descrição disponível';
                                        }
                                        bookDiv.appendChild(description);
                                  
                                        booksDiv.appendChild(bookDiv);
                                      });
                                    }
                                  
                                    function handleScroll() {
                                      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
                                      if (scrollTop + clientHeight >= scrollHeight - 10) {
                                        window.removeEventListener('scroll', handleScroll); // Remove o listener para evitar chamadas repetidas
                                        loaderDiv.classList.remove('hidden');
                                        loadingDiv.classList.remove('hidden');
                                        startIndex += maxResults;
                                        fetchBooks(startIndex).finally(() => {
                                          window.addEventListener('scroll', handleScroll);
                                        });
                                      }
                                    }
                                  
                                    searchButton.addEventListener('click', () => {
                                      query = searchInput.value.trim();
                                      if (query) {
                                        startIndex = 0;
                                        booksDiv.innerHTML = ''; // Limpa livros anteriores
                                        loaderDiv.classList.remove('hidden');
                                        loadingDiv.classList.remove('hidden');
                                        fetchBooks(startIndex);
                                      }
                                    });
                                  
                                    window.addEventListener('scroll', handleScroll);
                                  
                                    // Carregar livros iniciais ao carregar a página
                                    fetchBooks(startIndex);
                                  });
                                  