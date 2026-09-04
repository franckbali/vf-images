/* VF Images — Nav hide-on-scroll partagé
   La nav se cache quand on descend (immersion photo), revient dès qu'on remonte,
   reste toujours visible tout en haut. Aucun effet sur mobile (nav plus petite déjà).
   Elle prend aussi un fond verre dépoli (.scrolled) dès qu'on quitte le haut de page,
   pour rester lisible sur n'importe quel contenu qui défile dessous. */
(function(){
  var nav = document.querySelector('nav');
  if(!nav) return;
  var lastY = window.scrollY;
  var ticking = false;
  var THRESHOLD_TOP = 80;   // toujours visible tant qu'on est proche du haut
  var THRESHOLD_DELTA = 6;  // ignore les micro-scrolls (trackpad shake)

  function update(){
    var y = window.scrollY;
    var delta = y - lastY;

    if(y < THRESHOLD_TOP){
      // Zone haute : toujours visible
      nav.classList.remove('hidden');
    } else if(delta > THRESHOLD_DELTA){
      // Scroll vers le bas : cacher
      nav.classList.add('hidden');
    } else if(delta < -THRESHOLD_DELTA){
      // Scroll vers le haut : montrer
      nav.classList.remove('hidden');
    }

    nav.classList.toggle('scrolled', y >= THRESHOLD_TOP);

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function(){
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, {passive:true});

  // Si un menu overlay mobile est ouvert, on force la nav visible
  var overlay = document.getElementById('nav-overlay');
  if(overlay){
    new MutationObserver(function(){
      if(overlay.classList.contains('open')) nav.classList.remove('hidden');
    }).observe(overlay, {attributes:true, attributeFilter:['class']});
  }
})();
