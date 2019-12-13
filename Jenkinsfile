#!/usr/bin/env groovy

// triggered by GitHub in Jenkins-Pipeline

// global variables
def REGISTRY='dockerregistry.eigenbaumarkt.com'
// @Field REGISTRY_USER='dockerregistry-login'
def IMAGE_NAME='mesqualito/jhipster_de'
def IMAGE_TAG='latest'
// def CONTAINER_HTTP_PORT='8080'

node {
    stage('checkout') {
        checkout scm
    }

    docker.image('jhipster/jhipster:v6.5.1').inside('-u jhipster -e MAVEN_OPTS="-Duser.home=./"') {
        stage('check java') {
            sh "java -version"
        }

        stage('clean') {
            sh "chmod +x mvnw"
            sh "./mvnw -ntp clean"
        }
        stage('nohttp') {
            sh "./mvnw -ntp checkstyle:check"
        }

        stage('install tools') {
            sh "./mvnw -ntp com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v12.13.0 -DnpmVersion=6.13.0"
        }

        stage('npm install') {
            sh "./mvnw -ntp com.github.eirslett:frontend-maven-plugin:npm"
        }

        stage('backend tests') {
            try {
                sh "./mvnw -ntp verify"
            } catch(err) {
                throw err
            } finally {
                junit '**/target/test-results/**/TEST-*.xml'
            }
        }

        stage('frontend tests') {
            try {
                sh "./mvnw -ntp com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='run test'"
            } catch(err) {
                throw err
            } finally {
                junit '**/target/test-results/**/TEST-*.xml'
            }
        }

        stage('packaging') {
            sh "./mvnw -ntp verify -Pprod -DskipTests"
            archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
        }
    }

    def dockerImage
    stage('publish docker') {
        withCredentials([usernamePassword( credentialsId: 'dockerregistry-login',
            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            sh "./mvnw -ntp -X jib:build -Dimage=$REGISTRY/$IMAGE_NAME:$IMAGE_TAG -Djib.to.auth.username=${USERNAME} -Djib.to.auth.password=${PASSWORD}"
        }
    }
}
