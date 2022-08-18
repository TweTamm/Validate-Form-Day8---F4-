function Validator(options){
    function formParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    var selectorRules = {}

    function Validate(inputElement, rule){
        var errorMessage = rule.test(inputElement.value)
        var errorElement = formParent(inputElement, options.formParent).querySelector(options.errMessage)

        var rules = selectorRules[rule.selector]
        for(i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }

        if(errorMessage){
            formParent(inputElement, options.formParent).classList.add('invalid')
            errorElement.innerText = errorMessage
        } else {
            formParent(inputElement, options.formParent).classList.remove('invalid')
            errorElement.innerText = ''
        }
        return (!errorMessage)
    }
    var formElement = document.querySelector(options.form)

    formElement.addEventListener('submit', function(e){
        e.preventDefault()

        var isFormValid = true;

        options.rules.forEach(function(rule){
        var inputElement = formElement.querySelector(rule.selector)
        var isValid = Validate(inputElement, rule)
        if(!isValid){
            isFormValid = false
        }
        })
        if(isFormValid){
            if(typeof options.onSubmit === 'function')
            var enableInputs = formElement.querySelectorAll('[name]')
            var formValues = Array.from(enableInputs).reduce(function(values, input){
                 values[input.name] = input.value
                 return values
            },{})
        } 
        options.onSubmit(formValues)
    })


    if(formElement){
        options.rules.forEach(function(rule){

        if(Array.isArray(selectorRules[rule.selector])){
            selectorRules[rule.selector].push(rule.test)
        }else{
           selectorRules[rule.selector] = [rule.test]
        }
            var inputElement = formElement.querySelector(rule.selector)
            if(inputElement){
               inputElement.onblur = function(){
                  Validate(inputElement, rule)
               }
               inputElement.oninput = function(){
                var errorElement = formParent(inputElement, options.formParent).querySelector(options.errMessage)
                formParent(inputElement, options.formParent).classList.remove('invalid')
                errorElement.innerText = ''
               }
            }
        })
    }
}

Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : 'Please enter this field'
        }
    }
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: function(value){
            var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return regex.test(value.trim()) ? undefined : 'This field must be email'
        }
    }
}

Validator.minLength = function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.trim().length >= min ? undefined : `Please enter at least ${min} chacracters`
        }
    }
}

Validator.cfPassword = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function(value){
            return value.trim() === getConfirmValue() ? undefined : message || 'Password is not incorrect'
        }
    }
}