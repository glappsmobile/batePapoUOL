const InputUtils = {
    onEnterReleased: (fun, input, doPreventDefault) => {
        input.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {

              if (doPreventDefault || doPreventDefault === undefined){
                event.preventDefault();
              }

              fun();
            }
        });
    }
}