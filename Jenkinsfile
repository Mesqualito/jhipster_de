#!/usr/bin/env groovy
// triggered by GitHub in Jenkins-Pipeline

// global variables
def REGISTRY_URL='https://dockerregistry.eigenbaumarkt.com'
def REGISTRY_USER='dockerregistry-login'
def IMAGE_NAME='mesqualito/jhipster_de'
def IMAGE_TAG='latest'
// def CONTAINER_HTTP_PORT='8080'

node {
    stage('checkout') {
        checkout scm
    }

    docker.image('jhipster/jhipster:v6.5.1').inside('-u jhipster') {
        stage('check java') {
            sh "java -version"
        }

        stage('clean') {
            sh "chmod +x mvnw"
            sh "./mvnw clean --no-daemon"
        }

        stage('npm install') {
            sh "./mvnw npm_install -PnodeInstall --no-daemon"
        }

        stage('backend tests') {
            try {
                sh "./mvnw test -PnodeInstall --no-daemon"
            } catch(err) {
                throw err
            } finally {
                junit '**/build/**/TEST-*.xml'
            }
        }

        stage('frontend tests') {
            try {
                sh "./mvnw npm_run_test -PnodeInstall --no-daemon"
            } catch(err) {
                throw err
            } finally {
                junit '**/build/test-results/TESTS-*.xml'
            }
        }

        stage('packaging') {
            sh "./mvnw --no-daemon -i -x test -Pprod -PnodeInstall -Pwar clean bootWar"
            archiveArtifacts artifacts: '**/build/libs/*.war', fingerprint: true
        }

    }

    def dockerImage
    stage('build docker') {
        sh "cp -Rvvv src/main/docker build/"
        sh "cp -vvv build/libs/*.war build/docker/"
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
