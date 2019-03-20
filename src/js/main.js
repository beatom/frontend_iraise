/* body animation */
if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage());
}

var SEPARATION = 80, AMOUNTX = 20, AMOUNTY = 70;

var container, stats;
var camera, scene, renderer;


var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var particles, particle, count = 0;
init();
animate();

function init() {

  container = document.createElement('div');
  container.className = 'particles-js';
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.y = 500;
  camera.rotation.x = -1000;

  scene = new THREE.Scene();

  //

  var numParticles = AMOUNTX * AMOUNTY;

  var positions = new Float32Array(numParticles * 3);
  var scales = new Float32Array(numParticles);

  var i = 0, j = 0;

  for (var ix = 0; ix < AMOUNTX; ix++) {

    for (var iy = 0; iy < AMOUNTY; iy++) {

      positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
      positions[i + 1] = 0; // y
      positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z

      scales[j] = 1;

      i += 3;
      j++;

    }

  }


  var texture = new THREE.TextureLoader().load("/img/circle.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1));

  var color1 = new THREE.Color(0x972279);
  var color2 = new THREE.Color(0xff6000);
  var color4 = new THREE.Color(151, 34, 121);
  var color5 = new THREE.Color(255, 96, 0);
  //

  var geom = new THREE.TorusKnotGeometry(2.5, .5, 100, 16);
  geom.computeBoundingBox();
  var vertexIndices = ['a', 'b', 'c'];
  var face, vertex, normalized = new THREE.Vector3(), normalizedY = 0;
  var bbox = geom.boundingBox;
  var size = new THREE.Vector3().subVectors(bbox.max, bbox.min);
  var red = new THREE.Color("red"), blue = new THREE.Color("blue");

  for (var i = 0; i < geom.faces.length; i++) {
    face = geom.faces[i];
    for (var v = 0; v < 3; v++) {
      vertex = geom.vertices[face[vertexIndices[v]]];
      normalizedY = normalized.subVectors(vertex, bbox.min).divide(size).y;
      face.vertexColors[v] = red.clone().lerp(blue, normalizedY);
    }
  }
  var mat = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, wireframe: true});
  var material = new THREE.ShaderMaterial({

    uniforms: {
      // color: {value: new THREE.Color(color1)},
      amplitude: {value: 1.0},
      color: {value: new THREE.Color(0x972279)},
      // color: { value: new THREE.Color( 0xff6000 ) },
      texture: {value: texture}
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent

  });


  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {

  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

  if (event.touches.length === 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

  }

}

function onDocumentTouchMove(event) {

  if (event.touches.length === 1) {

    event.preventDefault();

    mouseX = event.touches[0].pageX - windowHalfX;
    mouseY = event.touches[0].pageY - windowHalfY;

  }

}

//

function animate() {
  particles.rotation.x += 0.0005;
  particles.rotation.y -= 0.0005;
  requestAnimationFrame(animate);

  render();
  // stats.update();

}

function render() {
  var positions = particles.geometry.attributes.position.array;
  var scales = particles.geometry.attributes.scale.array;

  var i = 0, j = 0;

  for (var ix = 0; ix < AMOUNTX; ix++) {

    for (var iy = 0; iy < AMOUNTY; iy++) {

      positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) +
          (Math.sin((iy + count) * 0.5) * 50);

      scales[j] = (Math.sin((ix + count) * 1.3) + 1) * 8 +
          (Math.sin((iy + count) * 0.5) + 1) * 8;

      i += 3;
      j++;

    }

  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  renderer.render(scene, camera);

  count += 0.1;

}

/* body animation end */

$('.mouse').click(function () {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top - 65
      }, 1000);
      return false;
    }
  }
});

/* carousel */

if ($(window).width() > 768) {
  let Carousel = function Carousel() {
    const increment = 80;
    let totalImages;
    let $images;
    let $carousel;
    let carouselWidth;

    let on = function () {
      $carousel = $('.carousel__container');
      $images = $('.carousel__item');
      carouselWidth = $carousel.width();
      totalImages = $images.length;
      position();
    }

    let position = function () {
      let number;
      let currentImage = $('.carousel__container--active').index();
      let x = 0;
      let z = 0;
      let zindex;
      let scaleX = 1;
      let scaleY = 1;
      let transformOrigin;

      $images.each(function (index, element) {
        scaleX = scaleY = 0.9;
        transformOrigin = carouselWidth / 2;
        if (index < currentImage) {
          number = 1;
          zindex = index + 1;
          x = carouselWidth / 2 - increment * (currentImage - index + 1);
          z = -increment * (currentImage - index + 1);
        } else if (index > currentImage) {
          number = -1
          zindex = totalImages - index;
          x = carouselWidth / 2 + increment * (index - currentImage + 1);
          z = -increment * (index - currentImage + 1);
        } else {
          number = 0;
          zindex = totalImages;
          x = carouselWidth / 2;
          z = 1;
          scaleX = scaleY = 1;
          transformOrigin = 'initial';
        }
        $(element).css(
            {
              'transform': 'translate3d(' + calculateX(x, number, 780) + 'px, 0,' + z + 'px) scale3d(' + scaleX + ',' + scaleY + ', 1)',
              'z-index': zindex,
              'transform-origin-x': transformOrigin
            }
        );
      });
    };

    let calculateX = function (position, number, width) {
      switch (number) {
        case 1:
        case 0:
          return position - width / 2;
        case -1:
          return position - width / 2;
      }
    }

    let imageSize = function () {
      return $carousel.width() / 3;
    }

    let recalculateSizes = function () {
      carouselWidth = $carousel.width();
      position();
    }

    let clickedImage = function () {
      let activeImage = $(this);
      let activeImageNumber = $(this).index();

      $('.carousel__container--active').removeClass('carousel__container--active');
      activeImage.addClass('carousel__container--active');
      position();
    }

    let clickedDot = function () {
      let target = $(this).index();

      $('.carousel__item[data-target=' + target + ']').click();
    }

    let prevNext = function () {
      let getClass = $(this).attr('class');

      if (getClass === 'carousel__arrow carousel__arrow--right') {
        $('.carousel__container--active').next().click();
      } else {
        $('.carousel__container--active').prev().click();
      }
    }

    let addEvents = function () {
      $(window).resize(recalculateSizes);
      $(document).on('click', '.carousel__item', clickedImage);
      $(document).on('click', 'li', clickedDot);
      $(document).on('click', '.carousel__arrow', prevNext);
    }

    return {
      init: function () {
        on();
        addEvents();
      }
    };
  }();

  $(function () {
    const carousel = Carousel.init();
  })
}
;
/* end carousel */

/* slick slider */
if ($(window).width() < 768) {
  $('.responsive').slick({
    dots: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
}


/* init WOW */
new WOW().init();


function autoType(elementClass, typingSpeed) {
  var thhis = $(elementClass);
  thhis = thhis.find(".team-title__typing");
  var text = thhis.text().trim().split('');
  var amntOfChars = text.length;
  var newString = "";
  thhis.text("|");
  setTimeout(function () {
    thhis.css("opacity", 1);
    thhis.text("");
    for (var i = 0; i < amntOfChars; i++) {
      (function (i, char) {
        setTimeout(function () {
          newString += char;
          thhis.text(newString);
        }, i * typingSpeed);
      })(i + 1, text[i]);
    }
  }, 1500);
}

$(document).ready(function () {
  autoType(".team-title", 200);
});

$('.show-video__already-seen, .show-video__close').click(function () {
  $('.show-video').hide();
});


/* slick slider date */
$('.single-item').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: '<button type="button" class="slick-prev"></button>',
  nextArrow: '<button type="button" class="slick-next"></button>'
});

/* month grafic */
Highcharts.chart('month-grafic', {
  chart: {
    styledMode: true,
    type: 'area',
    style: {
      fontFamily: 'serif'
    }
  },
  title: {
    text: '',
  },

  yAxis: {
    title: {
      text: ''
    },
    labels: {
      format: '{value}%'
    },
  },
  xAxis: {
    categories: ['Янв', 'Февр', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Нояб', 'Дек'],
    title: {
      enabled: false
    }
  },
  tooltip: {
    valueSuffix: '%',
    split: false,
    borderRadius: 30,
    distance: 30,
    padding: 10,

    shared: true

  },
  legend: {
    enabled: false
  },

  series: [{
    name: 'Доход',
    marker: {
      symbol: 'url(../img/grafic-ico.png)',
      width: 20,
      height: 20
    },
    data: [25, 56, 52, 75, 35, 80, 60],
    dashStyle: 'longdash'

  }],

  responsive: {
    rules: [{
      condition: {
        maxWidth: 930
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }

});
/* month grafic end */

/* days grafic */
Highcharts.chart('days-grafic', {
  chart: {
    styledMode: true,
    type: 'area'
  },
  title: {
    text: '',
  },

  yAxis: {
    title: {
      text: ''
    },
    labels: {
      format: '{value}%'
    },
  },
  xAxis: {
    categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    title: {
      enabled: false
    }
  },
  tooltip: {
    valueSuffix: '%',
    split: false,
    borderRadius: 30,
    distance: 30,
    padding: 10,

    shared: true

  },
  legend: {
    enabled: false
  },

  series: [{
    name: 'Доход',
    marker: {
      symbol: 'url(../img/grafic-ico.png)',
      width: 20,
      height: 20
    },
    data: [25, 56, 52, 75, 35, 80, 60],
    dashStyle: 'longdash'

  }],

  responsive: {
    rules: [{
      condition: {
        maxWidth: 930
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }

});
/* days grafic end */