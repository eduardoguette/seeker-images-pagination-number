const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const divPaginacion = document.querySelector('#paginacion')

window.onload = () => {
  formulario.addEventListener('submit', validarFormulario)
}
let pagina = 1
const resultsPorPagina = 30
let totalPaginas
let iterador

buscarImagenes()
function validarFormulario(e) {
  e.preventDefault()
  limpiarHTML(resultado)
  buscarImagenes()
}

function buscarImagenes() {
  limpiarHTML(divPaginacion)
  const busqueda = document.getElementById('termino').value
  const key = '13360577-1ec6494e0daacc37a199a6648'
  const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${resultsPorPagina}&page=${pagina}`
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
      totalPaginas = calcularPaginas(json.totalHits)
      mostrarImagenes(json.hits)
    })
    .catch((err) => {
      console.log(err)
    })
}
// generador que va a registrar la cantidad de elementos de acuerdo a las paginas

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / resultsPorPagina))
}

function mostrarImagenes(imagenes) { 
  limpiarHTML(resultado)
  imagenes.forEach((imagen) => {
    const { webformatURL, userImageURL, user, favorites, largeImageURL, previewURL, previewHeight, previewWidth, webformatWidth, webformatHeight, tags } = imagen

    const divCard = document.createElement('div')
    divCard.className = 'block card bg-white m-2 shadow-md rounded-md overflow-hidden'
    divCard.innerHTML = `
      <div class="wrapper">
        <div class="image relative group bg-gray-300">
            <img loading="lazy" class="object-cover group-focus:object-fit-contain" src="${webformatURL}" style="height:220px !important" width="300" alt="${user}">
            <a href="${largeImageURL}" class="absolute opacity-0 group-hover:opacity-100 right-1 top-1 text-center m-2 py-1 flex justify-center w-8 items-center bg-gray-100 bg-opacity-50 text-white font-medium text-xs rounded-md" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:"><path d="M13 3L16.293 6.293 9.293 13.293 10.707 14.707 17.707 7.707 21 11 21 3z"></path><path d="M19,19H5V5h7l-2-2H5C3.897,3,3,3.897,3,5v14c0,1.103,0.897,2,2,2h14c1.103,0,2-0.897,2-2v-5l-2-2V19z"></path></svg>
            </a>
          </div>
        <div class="info flex items-center space-x-2 px-3 py-5">
          <img src="${userImageURL}" class="rounded-full" height="25" width="25" alt="${user}">
          <span class="user">${user}</span>
        </div>
      </div>
        
      `
    resultado.appendChild(divCard)
  })
  imprimirPaginador()
}

function imprimirPaginador() {
  
  iterador = crearPaginador(totalPaginas)
  while (true) {
    const { value, done } = iterador.next()
    if (done) return
    
    // caso contrario genera un btn por cada elemento en el generador
    const button = document.createElement('a')
    button.href = '#'
    button.dataset.pagina = value
    button.textContent = value;
    button.className = "siguiente bg-yellow-400 mx-1 p-1 text-xs rounded  my-2"
    button.onclick = () => {
       
      pagina = value
      buscarImagenes()
    }
    divPaginacion.appendChild(button)
     
  }
}

window.addEventListener('scroll', () => {
  document.querySelectorAll('#resultado img[src]').forEach((elem) => {
    if (elem.getAttribute('src') === '') {
      elem.setAttribute('src', 'http://www.jdevoto.cl/web/wp-content/uploads/2018/04/default-user-img.jpg')
    }
  })
})

function limpiarHTML(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild)
  }
}
