// ページ読み込み後にMathJaxを検出して処理する
function detectAndInjectMathJax() {
  // MathJaxの要素を探す
  const hasMathJaxElements = document.querySelector('.MathJax') ||
    document.querySelector('.MathJax_Display') ||
    document.querySelector('.mjx-math');

  if (hasMathJaxElements || typeof window.MathJax !== 'undefined') {
    console.log("MathJaxが検出されました - レンダラーを変更します");

    // 外部スクリプトをロード（CSP回避策）
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injector.js');
    script.onload = function () {
      this.remove(); // スクリプトを実行後に削除
    };
    document.head.appendChild(script);
  }
}

// MathJaxが動的に追加される場合に備えて監視
function watchForMathJax() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        const hasMathJaxElements =
          document.querySelector('.MathJax') ||
          document.querySelector('.MathJax_Display') ||
          document.querySelector('.mjx-math');

        if (hasMathJaxElements) {
          console.log("MathJaxが動的に追加されました - レンダラーを変更します");
          observer.disconnect();

          const script = document.createElement('script');
          script.src = chrome.runtime.getURL('injector.js');
          script.onload = function () {
            this.remove();
          };
          document.head.appendChild(script);
          return;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // 1分後に監視を停止（パフォーマンスのため）
  setTimeout(() => {
    observer.disconnect();
  }, 60000);
}

// ページの読み込みが完了した時点で実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(detectAndInjectMathJax, 1000); // 少し遅延させる
    setTimeout(watchForMathJax, 1500);
  });
} else {
  setTimeout(detectAndInjectMathJax, 1000);
  setTimeout(watchForMathJax, 1500);
}
