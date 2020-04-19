// 使用函数委托来代替switch
//带有IF的代码：
function itemDropped(item, location) {
    if (!item) {
        return false;
    } else if (outOfBounds(location)) {
        var error = outOfBounds;
        server.notify(item, error);
        items.resetAll();
        return false;
    } else {
        animateCanvas();
        server.notify(item, location);
        return true;
    }
}
// 重构后代码：
function itemDropped(item, location) {
    const dropOut = function() {
        server.notify(item, outOfBounds);
        items.resetAll();
        return false;
    }

    const dropIn = function() {
        server.notify(item, location);
        animateCanvas();
        return true;
    }

    return !!item && (outOfBounds(location) ? dropOut() : dropIn());
}



//带有IF的代码：
function customerValidation(customer) {
  if (!customer.email) {
    return error('email is require')
  } else if (!customer.login) {
    return error('login is required')
  } else if (!customer.name) {
    return error('name is required')
  } else {
    return customer
  }
}
//复制代码重构后代码：
const customerValidation = customer =>
  !customer.email   ? error('email is required')
  : !customer.login ? error('login is required')
  : !customer.name  ? error('name is required')
                    : customer
//带有switch的代码：
switch(breed){
    case 'border':
      return 'Border Collies are good boys and girls.';
      break;  
    case 'pitbull':
      return 'Pit Bulls are good boys and girls.';
      break;  
    case 'german':
      return 'German Shepherds are good boys and girls.';
      break;
    default:
      return 'Im default'
}
// 复制代码重构后代码：
const dogSwitch = (breed) =>({
  "border": "Border Collies are good boys and girls.",
  "pitbull": "Pit Bulls are good boys and girls.",
  "german": "German Shepherds are good boys and girls.",  
})[breed]||'Im the default'


dogSwitch("border xxx")
