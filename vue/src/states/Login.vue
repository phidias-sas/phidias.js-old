<template>
	<div id="state-login">

		<form class="phi-card" @submit.prevent="login()">
			<img :src="app.logo" :alt="app.title">

			<div class="phi-card-contents">
				<phi-input v-model="username" label="usuario" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></phi-input>
				<phi-input v-model="password" label="contraseña" type="password"></phi-input>
			</div>

			<div class="phi-card-actions">
				<button class="phi-button login">
					<span v-show="!isLoading">ingresar</span>
					<span v-show="isLoading">ingresando</span>
				</button>
				<button class="phi-button google" type="button" @click="googleLogin()">ingresar con google</button>
			</div>
		</form>

		<router-link v-if="canChangeCode" to="/code" class="reset">Cambiar institución</router-link>

	</div>
</template>

<script>
import app from '../store/app.js';

export default {
	data () {
		return {
			app,
			username: null,
			password: null,
			error: null,
			isLoading: false,
			canChangeCode: true
		}
	},

	methods: {

		hasFocus (selector) {
			return false;
			return this.$el && this.$el.querySelector(selector).hasFocus();
		},

		login () {
			this.isLoading = true;

			this.app.login(this.username, this.password)
				.then(() => {
					this.isLoading = false;
					this.redirect();
				})
				.catch((error) => {
					this.isLoading = false;
				});
		},

		googleLogin () {
			this.app.googleLogin()
				.then(this.redirect);
		},

		redirect () {
			this.username = this.password = null;
			this.$router.push("/dashboard");
		}
	}
}

</script>


<style lang="sass">
#state-login {

    padding: 6px;
    padding-top: 5%;
	text-align: center;

	.phi-card {

        margin: auto;
        width: 100%;
        max-width: 600px;
		padding: 12px;

		img {
			max-width: 100%;
			margin: 24px auto;
			background-color: #2196F3;
		}
	}

	.phi-input {
		display: block;
		margin-bottom: 32px;
	}

	.phi-button {
		display: block;
		width: 100%;
		margin-bottom: 16px;

		&.google {
			background-color: #eee;
			color: #333;
		}
	}

	.reset {
		display: block;
		margin: auto;
        width: 100%;
        max-width: 600px;

		margin-top: 15px;

		padding: 12px;
		color: #555;
		text-transform: uppercase;
		text-decoration: none;
	}

}
</style>