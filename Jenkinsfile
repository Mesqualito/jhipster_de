#!/usr/bin/env groovy
// triggered by GitHub in Jenkins-Pipeline

// global variables
def REGISTRY_URL='https://dockerregistry.eigenbaumarkt.com'
def REGISTRY_USER='dockerregistry-login'
def IMAGE_NAME='mesqualito/jhipster_de'
def IMAGE_TAG='latest'

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
    stage('build docker') {
        sh "cp -Rvvv src/main/docker build/"
        sh "cp -vvv target/*.jar build/docker/"
        dockerImage = docker.build("$IMAGE_NAME:$IMAGE_TAG", "build/docker")
    }

    stage('publish docker') {
        docker.withRegistry("$REGISTRY_URL", "$REGISTRY_USER") {
            dockerImage.push "$IMAGE_TAG"
        }
    }

    stage('Remove Unused docker image') {
        sh "docker rmi $IMAGE_NAME:$IMAGE_TAG"
    }
}

