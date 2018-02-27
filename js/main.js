	var myFriendsVk = [];
	var myFriendsList = [];
	var lblock = document.querySelector('.lblock-list');
	var rblock = document.querySelector('.rblock-list');
	new Promise(function(resolve,rejected){
		VK.init({
			apiId: 6383899
		});

		VK.Auth.login(function(response){
			if (response.session) {
				resolve();
			}else {
				rejected(new Error('authenticated is false'))
			}
		});
	}).then(function(response){
			return new Promise(function(resolve,rejected){
				var list = JSON.parse(localStorage.getItem("list"));
				if (list) {
					resolve(list);
				}else {
					rejected();
				}
			}).then(
				response=>{
					myFriendsVk = response.myFriendsVk;
					myFriendsList = response.myFriendsList;
					renderFriends({array:response.myFriendsList,field:rblock});
					renderFriends({array:response.myFriendsVk,field:lblock});

				},
				response=>{
					return new Promise(function(resolve,rejected){
						VK.api('friends.get', {'fields':'photo_50'},response=>{
							if (response.error) {
								rejected(new Error(response.error.error_msg));
							}else {
								myFriendsVk = response.response;
								var option = {
									array:myFriendsVk,
									field:lblock
								}
								renderFriends(option);
								resolve();
							}
						})
					})
				}
			)
	}).catch(function(e){
		console.log(e)
	})


	function renderFriends(option){
		var source = friend.innerHTML;
		var template = Handlebars.compile(source);

		var obj = {
			friend: option.array
		}
		option.field.className == 'lblock-list' ? (obj.action = '✚') : (obj.action = '✖');

		var html = template(obj);		
		option.field.innerHTML += html;

		
	}


	function clickOnBlock(block, target){
		if (target.className == 'add-btn') {
				var photoThisFriend = target.parentNode.children[0].src;
				var fullNameThisFriend = target.previousElementSibling.innerHTML.split(' ');
				target.parentNode.remove();
				

				if (block.className == 'lblock-list') {
					for (var i = 0; i < myFriendsVk.length; i++) {
						if (myFriendsVk[i].photo_50 == photoThisFriend && myFriendsVk[i].first_name == fullNameThisFriend[0] && myFriendsVk[i].last_name == fullNameThisFriend[1]) {
							myFriendsList.push(myFriendsVk[i]);
							var oneFriend = myFriendsVk.splice(i,1);
							var option = {
								array: oneFriend,
								field: rblock
							}
							renderFriends(option);

						}
					}
				}

				if (block.className == 'rblock-list') {
					for (var i = 0; i < myFriendsList.length; i++) {
						if (myFriendsList[i].photo_50 == photoThisFriend && myFriendsList[i].first_name == fullNameThisFriend[0] && myFriendsList[i].last_name == fullNameThisFriend[1]) {
							myFriendsVk.push(myFriendsList[i]);
							var oneFriend = myFriendsList.splice(i,1);
							var option = {
								array:oneFriend,
								field: lblock
							}
							renderFriends(option);

						}
					}
				}

			}
	}


	function searchFriendByName(response, value,field){
		field.innerHTML = '';
		var array = [];
		var option = {
			array:array,
			field:field
		}
		for (var i = 0; i < response.length; i++) {
			var fullName = response[i].first_name.toLowerCase() + ' ' + response[i].last_name.toLowerCase();
			if (fullName.indexOf(value) != -1) {
				array.push(response[i]);
			}
		}

		if (array.length != 0) {
			return option;
		}
		if (value && array.length == 0) {
			return option;
		}

		option.array = response;
		return option;
	}

	// script search my friend
	var lsearch = document.querySelector('.lsearch');
	lsearch.addEventListener('input',function(){
		renderFriends(searchFriendByName(myFriendsVk, lsearch.value, lblock));
	});

	var rsearch = document.querySelector('.rsearch');
	rsearch.addEventListener('input',function(){
		renderFriends(searchFriendByName(myFriendsList, rsearch.value, rblock));
	});
	// <***************************>

	// script add freinds in one or two block
	lblock.addEventListener('click', function(e){
		var target = e.target;
		clickOnBlock(this, target);	
	});

	rblock.addEventListener('click', function(e){
		var target = e.target;
		clickOnBlock(this, target);	
	});
	// <***************************>

	// script save two list in local-storage
	var save = document.querySelector('.save');
	save.addEventListener('click',function(){
		var myFriends = {
			myFriendsVk: myFriendsVk,
			myFriendsList: myFriendsList
		}
		localStorage.setItem("list", JSON.stringify(myFriends));
	})
	// <******************************>

