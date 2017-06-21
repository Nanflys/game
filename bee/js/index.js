


box.style.width = document.documentElement.clientWidth + 'px';
box.style.height = document.documentElement.clientHeight + 'px';





// 获取点击开始游戏按钮，添加点击事件

	var oBtn = document.querySelector('.start');
	var tips = document.querySelector('.tips');

	oBtn.style.left = (document.documentElement.clientWidth - oBtn.offsetWidth)/2 +'px';
	oBtn.style.top = (document.documentElement.clientHeight - oBtn.offsetHeight)/2 + 'px';

	oBtn.onclick = function(){
		this.style.display = 'none';
		tips.style.display = 'none';
		Game.init('box');	//	游戏开始
	}
console.log(document.documentElement.clientWidth);


//开始游戏

	var Game = {
		oEnemy:{	//敌方数据
			e1:{
				style:'littleBee1',
				blood:1,
				speed:5,
				score:1
			},
			e2:{
				style:'littleBee2',
				blood:2,
				speed:7,
				score:2
			},
			e3:{
				style:'littleBee3',
				blood:3,
				speed:10,
				score:3
			}
		},

		checkPoint:[	//关卡的数据
			{
				eMap : ['e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
						'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
						'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
						'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
						'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
						'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
				],
				colNum:10,
				iSpeedX:10,
				iSpeedY:10,
				times:2000
			},
			{
				eMap : ['e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
						'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
						'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
						'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
						'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
						'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
				],
				colNum:10,
				iSpeedX:10,
				iSpeedY:10,
				times:2000
			}
		],
		air:{	//飞机的数据
			style:'air1',
			bulletStyle:'bullet'
		},

		init:function(id){	//初始化
			this.oParent = document.getElementById(id);
			this.createScore();
			this.createEmeny(0);
			this.createAir();
		},
		createScore:function(){		//创建积分
			var oD = document.createElement('div');
			oD.className = 'score';
			oD.innerHTML = '积分：<span>0</span>';
			this.oParent.appendChild(oD);

			this.oDNum = oD.getElementsByTagName('span')[0];
		},
		createEmeny:function(iNow){		//创建敌方小蜜蜂
			if(this.oUl){
				clearInterval(this.oUl.timer);
				this.oParent.removeChild(this.oUl);
			}

			document.title = '第'+(iNow)+'关';

			var checkPoint = this.checkPoint[iNow];

			var oUl = document.createElement('ul');

			var arr = [];
			oUl.id = 'bee';
			oUl.style.width = checkPoint.colNum * 40 + 'px';
			this.oParent.appendChild(oUl);
			oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px';

			this.oUl = oUl;

			//创建蜜蜂小方阵
			for (var i = 0; i < checkPoint.eMap.length; i++) {
				var oLi = document.createElement('li');
				oLi.className = this.oEnemy[checkPoint.eMap[i]].style;
				oLi.blood = this.oEnemy[checkPoint.eMap[i]].blood;
				oLi.speed = this.oEnemy[checkPoint.eMap[i]].speed;
				oLi.score = this.oEnemy[checkPoint.eMap[i]].score;
				oUl.appendChild(oLi);
			}
			this.allLi = oUl.getElementsByTagName('li');

			for(var i = 0; i < this.allLi.length; i++){
				arr.push([this.allLi[i].offsetLeft,this.allLi[i].offsetTop])
			}

			for(var i = 0; i < this.allLi.length; i++){
				this.allLi[i].style.position = 'absolute';
				this.allLi[i].style.left = arr[i][0] + 'px';
				this.allLi[i].style.top = arr[i][1] + 'px';
			}
			this.runEnemy(checkPoint);
		},
		runEnemy:function(checkPoint){	//敌方移动
			var This = this;
			var L = 0;
			var R = this.oParent.offsetWidth - this.oUl.offsetWidth;
			this.oUl.timer = setInterval(function(){

				if(This.oUl.offsetLeft > R){
					checkPoint.iSpeedX *= -1;
					This.oUl.style.top = This.oUl.offsetTop + checkPoint.iSpeedY + 'px';
				}else if(This.oUl.offsetLeft < L){
					checkPoint.iSpeedX *= -1;
					This.oUl.style.top = This.oUl.offsetTop + checkPoint.iSpeedY + 'px';
				}

				This.oUl.style.left = This.oUl.offsetLeft + checkPoint.iSpeedX + 'px';
			},200)

			setInterval(function(){
				This.attack();
			},checkPoint.times)
		},
		attack:function(){	//敌方攻击
			var nowLi = this.allLi[Math.floor(Math.random()*this.allLi.length)];
			var This  = this;
			nowLi.timer = setInterval(function(){
				var a = (This.oPlane.offsetLeft + This.oPlane.offsetWidth/2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + This.oPlane.offsetWidth/2);
				var b = (This.oPlane.offsetTop + This.oPlane.offsetHeight/2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + This.oPlane.offsetHeight/2);

				var c = Math.sqrt(a*a + b*b);

				var isX = nowLi.speed * a / c;
				var isY = nowLi.speed * b / c;

				nowLi.style.left = nowLi.offsetLeft + isX + 'px';
				nowLi.style.top = nowLi.offsetTop + isY + 'px';

				if(This.collision(This.oPlane,nowLi)){
					alert('游戏结束');
					window.location.reload();
				}
			},30);
		},
		createAir:function(){	//创建飞机
			var oPlane = document.createElement('div');
			oPlane.className = this.air.style;

			this.oPlane = oPlane;
			this.oParent.appendChild(oPlane);
			oPlane.style.left = (this.oParent.offsetWidth - oPlane.offsetWidth)/2 + 'px';
			oPlane.style.top = this.oParent.offsetHeight - oPlane.offsetHeight + 'px';
			this.handleAir();
		},
		handleAir:function(){	//操作飞机
			var timer = null;
			var iNum = 0;
			var This = this;

			var bLeft = bTop = bRight = bBottom = bCtrlKey = false;

			setInterval(function (){
			if (bLeft){
				This.oPlane.style.left = This.oPlane.offsetLeft - 10 + "px"
			}else if (bRight){
				This.oPlane.style.left = This.oPlane.offsetLeft + 10 + "px"
			}
			if (bTop){
				This.oPlane.style.top = This.oPlane.offsetTop - 10 + "px" 
			}else if(bBottom){
				This.oPlane.style.top = This.oPlane.offsetTop + 10 + "px"
			}
				//防止溢出
				limit();
			},30);

			document.onkeydown  = function(ev){
				var ev = ev || window.event;

				bCtrlKey = event.ctrlKey;
				switch (event.keyCode){
					case 37:
						bLeft = true;
						break;
					case 38:
						bTop = true;
					break;
					case 39:
						bRight = true;
						break;
					case 40:
						bBottom = true;
					break;
					case 49:
						bCtrlKey && (This.oPlane.style.background = "green");
						break;
					case 50:
						bCtrlKey && (This.oPlane.style.background = "yellow");
						break;
					case 51:
						bCtrlKey && (This.oPlane.style.background = "blue");
						break;
				}
					return false
				};
				document.onkeyup = function (event)
				{
				switch ((event || window.event).keyCode){
					case 37:
						bLeft = false;
						break;
					case 38:
						bTop = false;
						break;
					case 39:
						bRight = false;
						break;
					case 40:
						bBottom = false;
						break;
					case 81:
						This.createBullet();
						break;
					}
				};

				function limit(){
				var oBox = [box.clientWidth, box.clientHeight]
				//防止左侧溢出
				This.oPlane.offsetLeft <=0 && (This.oPlane.style.left = 0);
				//防止顶部溢出
				This.oPlane.offsetTop <=800 && (This.oPlane.style.top = 800);
				//防止右侧溢出
				oBox[0] - This.oPlane.offsetLeft - This.oPlane.offsetWidth <= 0 && (This.oPlane.style.left = oBox[0] - This.oPlane.offsetWidth + "px");
				//防止底部溢出
				oBox[1] - This.oPlane.offsetTop - This.oPlane.offsetHeight <= 0 && (This.oPlane.style.top = oBox[1] - This.oPlane.offsetHeight + "px")
				}
				console.log(box.clientWidth)


				// console.log(ev.keyCode)
				// if(!timer){
				// 	timer = setInterval(airRun,30)
				// }
				// if(ev.keyCode == 37){
				// 	iNum = 1;
				// }
				// else if(ev.keyCode == 38){
				// 	iNum = 3
				// }
				// else if(ev.keyCode == 39){
				// 	iNum = 2;
				// }
				// else if(ev.keyCode == 40){
				// 	iNum = 4;
				// };

				// document.onkeyup = function(){
				// 	clearInterval(timer);
				// 	timer = null;
				// 	iNum = 0;

				// 	if(ev.keyCode == 81){
				// 		This.createBullet();
				// 	}
				// }

				// function airRun(){
				// 	if(iNum == 1){
				// 		This.oPlane.style.left = This.oPlane.offsetLeft - 10 + 'px';
				// 	}else if(iNum == 2){
				// 		This.oPlane.style.left = This.oPlane.offsetLeft + 10 + 'px';
				// 	}
				// 	if(iNum == 3){
				// 		This.oPlane.style.top = This.oPlane.offsetTop - 10 + 'px';
				// 	}else if(iNum == 4){
				// 		This.oPlane.style.top = This.oPlane.offsetTop + 10 + 'px';
				// 	}
				// }
			
		},
		createBullet:function(){	//创建子弹
			var oBullet = document.createElement('div');
			oBullet.className = this.air.bulletStyle;
			this.oParent.appendChild(oBullet);

			oBullet.style.left = this.oPlane.offsetLeft + this.oPlane.offsetWidth / 2 + 'px';
			oBullet.style.top = this.oPlane.offsetTop - 10 + 'px';

			this.runBullet(oBullet);
		},
		runBullet:function(oBullet){	//子弹运动
			var This = this;
			oBullet.timer = setInterval(function(){
				if(oBullet.offsetTop < -15){
					clearInterval(oBullet.timer);
					This.oParent.removeChild(oBullet);
				}else{
					oBullet.style.top = oBullet.offsetTop - 10 + 'px';
				}

				for(var i = 0;i < This.allLi.length;i++){
					if(This.collision(oBullet,This.allLi[i])){

						if(This.allLi[i].blood == 1){
							clearInterval(This.allLi[i].timer);
							This.oDNum.innerHTML = parseInt(This.oDNum.innerHTML) + This.allLi[i].score;
							This.oUl.removeChild(This.allLi[i]); 
						}else{
							This.allLi[i].blood--;
						}
						
						clearInterval(oBullet.timer);
						This.oParent.removeChild(oBullet);
					}
				}

				if(!This.allLi.length){
					This.createEmeny(1);
				}
			},30)
		},
		collision:function(obj1,obj2){	//碰撞检测
			var L1 = obj1.offsetLeft;
			var R1 = obj1.offsetLeft + obj1.offsetWidth;
			var T1 = obj1.offsetTop;
			var B1 = obj1.offsetTop + obj1.offsetHeight;

			var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
			var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
			var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
			var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;

			if(R1 < L2 || L1 > R2 || B1 < T2 || T1 > B2){
				return false;
			}else{
				return true;
			}
		}
	}




































