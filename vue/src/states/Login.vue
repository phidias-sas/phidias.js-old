<template>
	<div id="state-login">

		<form class="phi-card" @submit.prevent="login()">
			<img :src="app.logo" :alt="app.title">

			<div class="phi-card-contents">
				<phi-input @input="error = null" v-model="username" label="usuario" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></phi-input>
				<phi-input @input="error = null" v-model="password" label="contraseña" type="password"></phi-input>
			</div>

			<div class="phi-card-actions">
				<button class="phi-button login" :class="{danger: !!error}">
					<span v-show="isLoading">ingresando</span>
					<span v-show="!isLoading && !error">ingresar</span>
					<span v-show="!isLoading && error" v-text="error"></span>
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
			canChangeCode: true
		}
	},

	computed: {
		isLoading () {
			return app.api.isLoading;
		}
	},

	methods: {
		login () {
			this.error = null;

			if (!this.username || !this.password) {
				this.error = "debes escribir tu usuario y contraseña";
				return;
			} 

			this.app.login(this.username, this.password)
				.then(() => {
					this.redirect();
				})
				.catch((error) => {
					this.error = "usuario o contraseña incorrectos";
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
	},

	/*
	Autofocus is REALLY anoying on mobile because it opens the keyboard unexpectedly
	mounted () {
		this.$el.querySelector("input").focus();
	}
	*/
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