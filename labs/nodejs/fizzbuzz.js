function fizzbuzz_if() {
    for (let i = 1; i <= 30; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log('fizzbuzz');
        } else if (i % 3 === 0) {
            console.log('fizz');
        } else if (i % 5 === 0) {
            console.log('buzz');
        } else {
            console.log(i);
        }
    }
}

function fizzbuzz_switch() {
    for (let i = 1; i <= 30; i++) {
        switch (true) {
            case i % 3 === 0 && i % 5 === 0:
                console.log('fizzbuzz');
                break;
            case i % 3 === 0:
                console.log('fizz');
                break;
            case i % 5 === 0:
                console.log('buzz');
                break;
            default:
                console.log(i);
        }
    }
}

fizzbuzz_if();
fizzbuzz_switch();
