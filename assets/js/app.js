///////// LANG TOGGLE /////////

function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}

function toggleDropdown2() {
  document.getElementById("myDropdown2").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}

///////// SLIDER ////////////

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}



/////// TRENDING CATEGORIES ///////

window.onload = function() {
    $('.slider').slick({
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev"></button>',
        nextArrow: '<button type="button" class="slick-next"></button>',
        centerMode: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 500, 
                settings: {
                    arrows: true, 
                    centerMode: false, 
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
};



document.addEventListener('DOMContentLoaded', function() {
 
  if(localStorage.getItem('basketstorage') === null) {
      localStorage.setItem('basketstorage', JSON.stringify([]));
  }

 
  let addbtn = document.querySelectorAll('.addtobtn');
  for(let btn of addbtn) {
      btn.onclick = function(e) {
          e.preventDefault();
          let storage = JSON.parse(localStorage.getItem('basketstorage'));
          let item = this.closest('.card-content');
          let id = item.getAttribute('data-card-id');
          let image = item.querySelector('img').src;
          let title = item.querySelector('h5').innerText;
          let price = parseFloat(item.querySelector('.price').innerText.replace('$', ''));
          let color = getColorOrDefault(item);

          let existProd = storage.find(item => item.id === id);

          if(existProd === undefined) {
              storage.push({
                  id: id,
                  title: title,
                  price: price,
                  image: image,
                  color: color,
                  count: 1
              });
          } else {
              existProd.count += 1;
          }

          localStorage.setItem('basketstorage', JSON.stringify(storage));
          showCount();
      };
  }


  function getColorOrDefault(item) {
      let colorInput = item.querySelector('input[type="radio"]:checked');
      if (colorInput) {
          return colorInput.value;
      } else {
          let defaultColorInput = item.querySelector('input[type="radio"]');
          return defaultColorInput ? defaultColorInput.value : null;
      }
  }


  function showCount() {
      let storage = JSON.parse(localStorage.getItem('basketstorage'));
      let count = document.querySelector('.count');
      count.innerHTML = storage.reduce((total, item) => total + item.count, 0);

      if(storage.length === 0) {
          count.style.display = 'none';
      } else {
          count.style.display = 'inline';
      }
  }

 
  function getProducts() {
      let storage = JSON.parse(localStorage.getItem('basketstorage'));
      let content = '';
      storage.forEach(item => {
          content += `
              <tr>
                  <td>
                      <div class="table-img"><img src="${item.image}" alt=""></div>
                  </td>
                  <td>
                      <div>
                          <h3>${item.title}</h3>
                          <h4>$ ${item.price}</h4>
                          <p>${item.color}</p>
                      </div>
                  </td>
                  <td>
                      <div>
                          <input class="changecount" min="0" max="25" type="number" value="${item.count}">
                          <i class="fa-regular fa-trash-can deletbtn" style="color: #ca2f2f;"></i>
                      </div>
                  </td>
                  <td>
                      <div>
                          <h4>${(item.price * item.count).toFixed(2)}$</h4>
                      </div>
                  </td>
              </tr>
          `;
      });

      document.querySelector('tbody').innerHTML = content;
      attachEventListeners();
  }

  
  function attachEventListeners() {
      const removeButtons = document.querySelectorAll('.deletbtn');
      removeButtons.forEach(button => {
          button.addEventListener('click', removeProduct);
      });

      document.querySelectorAll('.changecount').forEach(input => {
          input.addEventListener('input', function() {
              let productRow = this.closest('tr');
              let index = Array.from(productRow.parentNode.children).indexOf(productRow);

              let storage = JSON.parse(localStorage.getItem('basketstorage'));
              if (storage && storage[index]) {
                  storage[index].count = parseInt(this.value);
                  localStorage.setItem('basketstorage', JSON.stringify(storage));
                  updateProductPrice(productRow, storage[index]);
                  updateSubtotal();
                  showCount();
              }
          });
      });
  }

 
  function removeProduct(e) {
      e.preventDefault();
      let productRow = e.target.closest('tr');
      let index = Array.from(productRow.parentNode.children).indexOf(productRow);

      let storage = JSON.parse(localStorage.getItem('basketstorage'));
      if (storage) {
          storage.splice(index, 1);
          localStorage.setItem('basketstorage', JSON.stringify(storage));
      }

      productRow.remove();
      showCount();
      checkCartStatus();
      updateSubtotal();
  }

  
  function checkCartStatus() {
      let storage = JSON.parse(localStorage.getItem('basketstorage'));
      if (!storage || storage.length === 0) {
          document.getElementById('mycart').style.display = 'none';
          document.getElementById('emptyalert').classList.remove('d-none');
      } else {
          document.getElementById('mycart').style.display = 'block';
          document.getElementById('emptyalert').classList.add('d-none');
      }
  }

 
  function updateSubtotal() {
      let storage = JSON.parse(localStorage.getItem('basketstorage'));
      let total = 0;

      if (storage) {
          storage.forEach(item => {
              total += item.price * item.count;
          });
      }

      document.getElementById('subtotal').innerText = total.toFixed(2) + ' $';
  }

  
  function updateProductPrice(productRow, product) {
      let totalCell = productRow.querySelector('td:nth-child(4) h4');
      totalCell.textContent = (product.price * product.count).toFixed(2) + '$';
  }

  showCount();
  getProducts();
  checkCartStatus();
  updateSubtotal();
});
