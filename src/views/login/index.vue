<template>
	<div class="login-container">
		<div class="login-logo">
			<img src="../../assets/imgs/img_login_logo.png" />
		</div>
		<el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
			<h3 class="title">运营管理中心</h3>
			<el-form-item prop="username">
				<span class="svg-container svg-container_login">
          			<img src="../../assets/imgs/icon_login_user.png" />
        			</span>
				<el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<span class="svg-container svg-container_password">
          <img src="../../assets/imgs/icon_login_lock.png" />
        			</span>
				<el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
				<span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
			</el-form-item>
			<el-form-item class="loginBtn">
				<el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
					登 录
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'login',
		data() {
			return {
				loginForm: {
					username: '',
					password: ''
				},
				loginRules: {
					username: [{
						required: true,
						trigger: 'blur',
						message: '请输入用户名'
					}],
					password: [{
						required: true,
						trigger: 'blur',
						message: '请输入密码'
					}]
				},
				loading: false,
				pwdType: 'password'
			}
		},
		methods: {
			showPwd() {
				if(this.pwdType === 'password') {
					this.pwdType = ''
				} else {
					this.pwdType = 'password'
				}
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if(valid) {
						this.loading = true
						this.$store.dispatch('Login', this.loginForm).then(() => {
							this.loading = false
							this.$router.push({
								path: '/'
							})
						}).catch(() => {
							this.loading = false
						})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	$bg:#fff;
	$light_gray:#000;
	/* reset element-ui css */
	
	.login-container {
		.el-input {
			vertical-align: middle;
			display: inline-block;
			height: 41px;
			border-bottom: 1px solid #CCCCCC;
			width: calc(100% - 50px);
			input {
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 5px;
				color: $light_gray;
				height: 36px;
				&:-webkit-autofill { 
					-webkit-box-shadow: 0 0 0px 1000px #FFFFFF inset !important;
					-webkit-text-fill-color: #000 !important;
				}
			}
		}
		.el-form-item {
			color: #454545;
			.el-form-item__content {
				font-size: 0px;
				line-height: inherit;
				.el-form-item__error {
					left: 40px;
				}
			}
		}
	}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
	$bg:#fff;
	$dark_gray:#889aa4;
	$light_gray:#eee;
	.login-logo {
		position: absolute;
		left: 0;
		top: 110px;
		right: 0;
		width: 178px;
		height: 128px;
		margin: auto;
		img{
			width: 178px;
			height: 128px;
		}
	}
	
	.login-container {
		position: relative;
		height: 100%;
		min-height: 700px;
		width: 100%;
		background-image: url(../../assets/imgs/img_OT_bg.png);
		filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
		-moz-background-size: 100% 100%;
		background-size: 100% 100%;
		background-attachment: fixed;
		.login-form {
			position: absolute;
			left: 0;
			top: 269px;
			height: 320px;
			right: 0;
			width: 362px;
			padding: 35px 56px 15px 44px;
			margin: auto;
			border-radius: 5px;
			background-color: white;
			opacity: 0.9;
		}
		.loginBtn{
			margin-top:30px;
		}
		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;
			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}
		.svg-container {
			vertical-align: middle;
			width: 40px;
			text-align: left;
			display: inline-block;
			img {
				margin-top: 10px;
			}
			&_login {
				font-size: 26px;
				color: #409EFF;
			}
			&_password {
				font-size: 20px;
				color: #409EFF;
			}
		}
		.title {
			font-size: 20px;
			font-weight: 400;
			color: #000;
			margin: 0px auto 40px auto;
			text-align: center;
		}
		.rememberPassword {
			line-height: 40px;
			.el-col {
				vertical-align: middle;
			}
			.login-radio {
				.el-radio {
					line-height: 40px;
				}
			}
			.forget {
				font-size: 14px;
				text-align: right;
				span {
					cursor: pointer;
					&:hover {
						color: #409EFF;
					}
				}
			}
		}
		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}
	}
</style>