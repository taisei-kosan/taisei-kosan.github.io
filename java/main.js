document.addEventListener('DOMContentLoaded', function () {

  const wrapper = document.getElementById('slideWrapper');
  const slides = document.querySelectorAll('.slide-item'); 
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dots = document.querySelectorAll('.dot');

  if (slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideInterval = 5000; // 5秒ごとに切り替え

    // ーーーーー【ここを修正しました】ーーーーー
    // 最初の1枚目（0番目）を指す [0] が抜けていたため、正しく [0] を追加しました
    slides[0].classList.add('active-slide');
    // ーーーーーーーーーーーーーーーーーーーーー

    // 初期の配置状態をJavaScript側で確実にセット（CSSとの競合を防止）
    slides.forEach((slide, idx) => {
      slide.style.position = 'absolute';
      slide.style.top = '0';
      slide.style.left = '0';
      slide.style.width = '100%';
      slide.style.transition = 'none';
      
      if (idx === 0) {
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
        slide.style.zIndex = '2';
        slide.style.position = 'relative'; // 1枚目だけ枠の高さを作る
      } else {
        slide.style.opacity = '0';
        slide.style.visibility = 'hidden';
        slide.style.zIndex = '1';
      }
    });

    // 完璧なクロスフェード（溶け合う）を実行する関数
    function showSlide(index) {
      let nextIndex = 0;
      if (index >= totalSlides) {
        nextIndex = 0;
      } else if (index < 0) {
        nextIndex = totalSlides - 1;
      } else {
        nextIndex = index;
      }

      if (currentIndex === nextIndex) return;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[nextIndex];

      // 1. 次の写真を裏側（z-index: 1）に100%の濃さで配置
      nextSlide.style.zIndex = '1';
      nextSlide.style.opacity = '1';
      nextSlide.style.visibility = 'visible';
      nextSlide.style.position = 'absolute';

      // 2. 現在の古い写真を最前面（z-index: 2）に維持
      currentSlide.style.zIndex = '2';
      currentSlide.style.position = 'relative'; // 高さをキープ

      // 3. 古い写真を1.5秒かけてじわーーっと透明に
      currentSlide.style.transition = 'opacity 1500ms ease-in-out';
      
      setTimeout(() => {
        currentSlide.style.opacity = '0';
      }, 20);

      // 4. アニメーション終了後の後処理（重なり順とrelativeのバトンタッチ）
      setTimeout(() => {
        currentSlide.style.transition = 'none';
        currentSlide.style.visibility = 'hidden';
        currentSlide.style.zIndex = '1';
        currentSlide.style.position = 'absolute';
        currentSlide.classList.remove('active-slide');
        
        nextSlide.style.zIndex = '2';
        nextSlide.style.position = 'relative'; // 次の画像に高さの役割を引き継ぐ
        nextSlide.classList.add('active-slide');
      }, 1520);

      // 番号を更新
      currentIndex = nextIndex;

      // ドットの表示を更新
      if (dots.length > 0) {
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }

    // ボタンとドットのクリックイベント
    if (nextBtn) nextBtn.addEventListener('click', () => { showSlide(currentIndex + 1); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { showSlide(currentIndex - 1); resetTimer(); });
    if (dots.length > 0) {
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => { showSlide(idx); resetTimer(); });
      });
    }

    // 自動タイマー
    let autoSlide = setInterval(() => { showSlide(currentIndex + 1); }, slideInterval);
    function resetTimer() {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => { showSlide(currentIndex + 1); }, slideInterval);
    }
    
    console.log("スライダーが正常に復活しました。");
  }
});