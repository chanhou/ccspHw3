(function(){

// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>

// 點擊按鈕時，插入新項目
addButton.on('click', function(){
  $(tmpl).prependTo(mainUl).addClass('is-editing').find('input').focus();
});

// 按 Enter 鍵時完成編輯並存檔
//
mainUl.on('keyup', 'input', function(e){
  // 若目前的鍵是「enter」
  if(e.which === 13){
    var input = $(this), li = input.parents('li');

    // 把 <input> 的值複製到 <span> 裡
    li.find('span').text( input.val() );
    // 取消 <li> 的編輯模式（is-editing class）
    li.removeClass('is-editing');
    //save();
    // add a new item
    $.ajax({
      type:'POST',
      url:'/items',
      data:{
        name:input.val(),
        value:0//havent done
      },
      datatype:'json',
      success:function(result){
        console.log("add success!");
      }
    });
    // 把整個表存進 localStorage
    
  }
});

// 從 localStorage 讀出整個表，放進 ul
load();

// 把 mainul 初始化為 sortable
mainUl.sortable({
	tolerance:"pointer",
	connectWith: '.connected',
	//dropOnEmpty: false, 不能丟進空的list
	start: function(e,ui){
    placeholder.addClass("is-dragging");
    po=ui.item.index();
	},
	stop: function(e, ui){
    placeholder.removeClass("is-dragging");
    var newpo=ui.item.index();
    //update a new position
    $.ajax({
      type:'PUT',
      url:'/items/'+po+'/reposition/'+newpo,
      success:function(result){
        console.log("rePosition success!");
      }
    });
    //save();
	}
});

// 把 doneul 初始化為 sortable
doneUl.sortable({
	tolerance:"intersect",
	connectWith: '.connected',
	receive: function(event,ui){
     $.ajax({
          type:'PUT',// new item
          url:'/items/'+ui.item.index(),
          success:function(result){
            console.log("update success!");
          }
        });
		$(ui.item.context.outerHTML).addClass("is-done").appendTo(mainUl);
		ui.item.remove();
    //item done and update
   
		//console.log(localStorage);
		//save();
		//$(ui.sender).sortable( "cancel" );
	}
});



// 把 deleteul 初始化為 sortable
deleteUl.sortable({
	tolerance:"intersect",
	connectWith: '.connected',
	receive: function(event,ui){
    //console.log(ui.item)
		ui.item.remove();
    //delete item
    $.ajax({
      type:'DELETE',
      url:'/items/'+ui.item.index(),//pass the current place
      success:function(result){
        console.log("delete success!");
      }
    });
		//save();
	}
});

// function save(){
//   // 準備好要裝各個項目的空陣列
//   var arr1 = []; //item storage
//   var arr2= []; //class storage
//   arr=[];
//   var count=0;
//   // 對於每個 li，
//   // 把 <span> 裡的文字放進陣列裡
//   mainUl.find('li').each(function(){
//     arr1.push($(this).text());

//     //console.log($(this));
//     if($(this).is("li.is-done")){
//       	arr2.push("y");
//         arr=arr.concat({id:count,name:$(this).text(),classes:"y"});
//     }
//     else {
//     	arr2.push("n");
//       arr=arr.concat({id:count,name:$(this).text(),classes:"n"});
//     }
//     count ++;
//   });
  
//   //console.log(arr1);
//   //console.log(arr2);
//   //console.log(arr);
//   arr=JSON.stringify(arr);
//   console.log(arr);
//   // 把陣列轉成 JSON 字串後存進 localStorage
//   localStorage.todoItems = JSON.stringify(arr1);
//   localStorage.classItems= JSON.stringify(arr2);
//   return arr;
// }

// 從 localStorage 讀出整個表，放進 <ul>
//
function load(){
  
  $.get('/items',function(data,status){
      console.log(data);
      data.forEach(function(item, key) {
            if(parseInt(item.value)==1){
                $(tmpl).appendTo(mainUl).addClass("is-done").find('span').text(item.name);
            }
            else {
                $(tmpl).appendTo(mainUl).find('span').text(item.name);
            }
        });
  });

// 從 localStorage 裡讀出陣列 JSON 字串
  // 把 JSON 字串轉回陣列
 //  var arr1 = JSON.parse( localStorage.todoItems ), i;
 //  var arr2 = JSON.parse( localStorage.classItems );
 //  // 對於陣列裡的每一個項目，插入回 ul 裡。
  
 //  for(i=0; i<arr1.length; i+=1){
 //  	if (arr2[i]=="y"){
 //    	$(tmpl).appendTo(mainUl).addClass("is-done").find('span').text(arr1[i]);
	// }
	// else{
	// 	$(tmpl).appendTo(mainUl).find('span').text(arr1[i]);
	// }
 //  }
//}
  }
}());