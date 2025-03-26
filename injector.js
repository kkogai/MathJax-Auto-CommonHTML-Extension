(function() {
  console.log("MathJaxレンダラー自動変更スクリプトが実行されました");
  
  try {
    if (typeof MathJax !== 'undefined') {
      console.log("MathJaxオブジェクトにアクセスできました");
      
      if (MathJax.Hub) {
        // MathJax v2
        MathJax.Hub.Queue(["setRenderer", MathJax.Hub, "CommonHTML"]);
        MathJax.Hub.Queue(["Rerender", MathJax.Hub]);
        console.log("MathJaxのレンダラーをCommonHTMLに変更しました");
      } else if (typeof MathJax.typeset === 'function') {
        // MathJax v3
        MathJax.typesetPromise().then(() => {
          console.log("MathJax v3で再レンダリングしました");
        });
      } else {
        console.log("対応するMathJax APIが見つかりません");
      }
    } else {
      console.log("このページのコンテキストではMathJaxが見つかりません");
    }
  } catch(e) {
    console.error("MathJax操作エラー:", e);
  }
})();
