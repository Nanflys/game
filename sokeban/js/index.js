
	$(function(){
		game.init($('#sokoban'));
	})

	var game = {
		checkPoint:[	//关卡数据
			{
				map:[
						1,1,2,2,2,2,1,1,
						1,1,2,3,3,2,1,1,
						1,2,2,0,3,2,2,1,
						1,2,0,0,0,3,2,1,
						2,2,0,0,0,0,2,2,
						2,0,0,2,0,0,0,2,
						2,0,0,0,0,0,0,2,
						2,2,2,2,2,2,2,2
				],
				box:[
					{x : 4, y : 3},
					{x : 3, y : 4},
					{x : 4, y : 5},
					{x : 5, y : 5}
				],
				person:{ x : 3,y : 6}
			},
		{
			map : [
				1,1,1,1,2,2,2,2,2,2,2,1,
				1,1,1,1,2,0,0,2,0,0,2,1,
				1,1,1,1,2,0,0,0,0,0,2,1,
				2,2,2,2,2,0,0,2,0,0,2,1,
				3,3,3,2,2,2,0,2,0,0,2,2,
				3,0,0,2,0,0,0,0,2,0,0,2,
				3,0,0,0,0,0,0,0,0,0,0,2,
				3,0,0,2,0,0,0,0,2,0,0,2,
				3,3,0,2,2,2,0,2,0,0,2,2,
				2,2,2,2,2,0,0,0,0,0,2,1,
				1,1,1,1,2,0,0,2,0,0,2,1,
				1,1,1,1,2,2,2,2,2,2,2,1
			],
			box : [
				{x : 5 , y : 6},
				{x : 6 , y : 3},
				{x : 6 , y : 5},
				{x : 6 , y : 7},
				{x : 6 , y : 9},
				{x : 7 , y : 2},
				{x : 8 , y : 2},
				{x : 9 , y : 6},
			],
			person : { x : 5 , y : 9 }
		}
		],
		init:function(oParent){		//初始化
			this.oParent = oParent;
			this.createMap(0);
		},
		createMap:function(iNow){	//创建地图

			this.oParent.empty();
			document.title = '第'+(iNow + 1)+'关';
			this.nowJson = this.checkPoint[iNow];

			this.oParent.css('width',Math.sqrt(this.nowJson.map.length)*50);

			$.each(this.nowJson.map,$.proxy(function(i,elem){
				this.oParent.append('<div class="background' + elem + '"></div>');
			},this));

			this.createBox();
			this.createPerson();
		},
		createBox:function(){	//创建箱子
			$.each(this.nowJson.box,$.proxy(function(i,elem){
				var oBox = $('<div class="box"></div>');
				oBox.css('left',elem.x*50);
				oBox.css('top',elem.y*50);

				this.oParent.append(oBox);
			},this))
		},
		createPerson:function(){	//创建人物
			var oPerson = $('<div class="person"></div>');
			oPerson.css('left',this.nowJson.person.x * 50);
			oPerson.css('top',this.nowJson.person.y * 50);

			oPerson.data('x', this.nowJson.person.x);
			oPerson.data('y', this.nowJson.person.y);

			this.oParent.append(oPerson);

			this.handlePerson(oPerson);
		},
		handlePerson:function(oPerson){	//对人物的操作
			$(document).keydown($.proxy(function(ev) {
				
				switch(ev.which){
					case 37: 	//左
						oPerson.css('backgroundPosition','-150px 0');

						this.movePerson(oPerson,{x:-1})

					break;
					case 38: 	//上
						oPerson.css('backgroundPosition','0 0');

						this.movePerson(oPerson,{y:-1})

					break;
					case 39: 	//右
						oPerson.css('backgroundPosition','-50px 0');


						this.movePerson(oPerson,{x:1})

					break;
					case 40: 	//下
						oPerson.css('backgroundPosition','-100px 0');

						this.movePerson(oPerson,{y:1})

					break;
				}
			},this));
		},
		movePerson:function(oPerson,ept){	//人物移动
			var stepX = ept.x || 0;
			var stepY = ept.y || 0;
			
			if(this.nowJson.map[(oPerson.data('y') + stepY) * Math.sqrt(this.nowJson.map.length) + (oPerson.data('x') + stepX)] != 2 ){

				oPerson.data('x', oPerson.data('x') + stepX);
				oPerson.data('y', oPerson.data('y') + stepY);
				oPerson.css('left',oPerson.data('x') * 50);
				oPerson.css('top',oPerson.data('y') * 50);

				$('.box').each($.proxy(function(i,elem){
					if(this.collision(oPerson,$(elem)) && this.nowJson.map[(oPerson.data('y') + stepY) * Math.sqrt(this.nowJson.map.length) + (oPerson.data('x') + stepX)] != 2){

						$(elem).css('left', (oPerson.data('x') + stepX) * 50);
						$(elem).css('top', (oPerson.data('y') + stepY) * 50);

						$('.box').each($.proxy(function(j,elem2){

							if(this.collision($(elem),$(elem2)) && elem != elem2){

								$(elem).css('left', oPerson.data('x') * 50);
								$(elem).css('top', oPerson.data('y') * 50);


								oPerson.data('x', oPerson.data('x') - stepX);
								oPerson.data('y', oPerson.data('y') - stepY);
								oPerson.css('left',oPerson.data('x') * 50);
								oPerson.css('top',oPerson.data('y') * 50);
							}

						},this));

					}else if(this.collision(oPerson,$(elem))){

						oPerson.data('x', oPerson.data('x') - stepX);
						oPerson.data('y', oPerson.data('y') - stepY);
						oPerson.css('left',oPerson.data('x') * 50);
						oPerson.css('top',oPerson.data('y') * 50);

					}
				},this))
			}
			this.nextShow();
		},
		nextShow:function(){	//下一关
			
			var iNum= 0;

			$('.background3').each($.proxy(function(i,elem){


				$('.box').each($.proxy(function(j,elem2){
					if(this.collision( $(elem) , $(elem2) ) ){
						iNum++;
					}
				},this));

			},this));

			if( iNum== $('.box').length ){
				this.createMap(1);
			}
		},
		collision:function(obj1,obj2){	//碰箱子
			var L1 = obj1.offset().left;
			var R1 = obj1.offset().left + obj1.width();
			var T1 = obj1.offset().top;
			var B1 = obj1.offset().top + obj1.height();

			var L2 = obj2.offset().left;
			var R2 = obj2.offset().left + obj2.width();
			var T2 = obj2.offset().top;
			var B2 = obj2.offset().top + obj2.height();

			if(L1 >= R2 || R1 <= L2 || B1 <= T2 || T1 >= B2){
				return false;
			}else{
				return true;
			}
		}
	}