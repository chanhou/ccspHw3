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

    // add a new item
    $.ajax({
      type:'POST',
      url:'/items',
      data:{
        name:input.val(),
        value:0//dont have .is-done class
      },
      datatype:'json',
      success:function(result){
        console.log("add success!");
      }
    });    
  }
});

// 從 server side json file 讀出整個表，放進 ul
load();

// 把 mainul 初始化為 sortable
mainUl.sortable({
	tolerance:"pointer",
	connectWith: '.connected',
	start: function(e,ui){
    placeholder.addClass("is-dragging");
    po=ui.item.index();//get original position
    console.log(ui.item.index());
	},
	stop: function(e, ui){
    placeholder.removeClass("is-dragging");
    var newpo=ui.item.index();//get new position
    
    //update a new position
    $.ajax({
      type:'PUT',
      url:'/items/'+po+'/reposition/'+newpo,
      success:function(result){
        console.log("rePosition success!");
      }
    });
	}
});

// 把 doneul 初始化為 sortable
doneUl.sortable({
	tolerance:"intersect",
	connectWith: '.connected',
	receive: function(event,ui){

     //update for is-done class
     $.ajax({
          type:'PUT',
          url:'/items/'+po,//get position from the mainUl.sortable
          success:function(result){
            console.log("update success!");
          }
        });
		$(ui.item.context.outerHTML).addClass("is-done").appendTo(mainUl);
		ui.item.remove();
	}
});



// 把 deleteul 初始化為 sortable
deleteUl.sortable({
	tolerance:"intersect",
	connectWith: '.connected',
	receive: function(event,ui){
		ui.item.remove();
    
    //delete item
    $.ajax({
      type:'DELETE',
      url:'/items/'+po,//get position from mainUl.sortable
      success:function(result){
        console.log("delete success!");
      }
    });
	}
});

function load(){
  //pass the file to front-end
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
  }
}());