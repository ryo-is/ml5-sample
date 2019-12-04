import Vue from "vue"
// import { HomeComponentState } from "@/types"
import p5js from "p5"
import ml5 from "ml5"

let leftShoulderX = 0
let leftShoulderY = 0

let rightShoulderX = 0
let rightShoulderY = 0
let leftElbowX = 0
let leftElbowY = 0

let rightElbowX = 0
let rightElbowY = 0

let leftWristX = 0
let leftWristY = 0

let rightWristX = 0
let rightWristY = 0

let leftHipX = 0
let leftHipY = 0

let rightHipX = 0
let rightHipY = 0

export default Vue.extend({
  data() {
    return {
      text: "hoge",
      video: null,
      poses: [],
      debug: false,
      p5: null
    }
  },
  mounted() {
    const sketch = (p: p5js) => {
      p.setup = () => {
        p.createCanvas(1280, 720)
        this.video = p.createCapture(this.p5.VIDEO)
        this.video.hide()
        const poseNet = ml5.poseNet(this.video, this.modelLoaded())
        poseNet.on("pose", (results: any) => this.gotPoses(results))
        this.p5.angleMode(this.p5.DEGREES)
      }
      p.draw = () => {
        this.p5.image(this.video, 0, 0)

        const bodyX =
          (rightShoulderX + leftShoulderX + rightHipX + leftHipX) / 4
        const bodyY =
          (rightShoulderY + leftShoulderY + rightHipY + leftHipY) / 4

        const arm_ratio = 1.5
        const leftHandX = leftElbowX + (leftWristX - leftElbowX) * arm_ratio
        const leftHandY = leftElbowY + (leftWristY - leftElbowY) * arm_ratio

        const rightHandX = rightElbowX + (rightWristX - rightElbowX) * arm_ratio
        const rightHandY = rightElbowY + (rightWristY - rightElbowY) * arm_ratio

        const angle = p.atan2(leftHandY - bodyY, leftHandX - bodyX)

        p.push()
        p.translate(bodyX, bodyY)
        const slide = 0.5
        p.translate((leftHandX - bodyX) * slide, (leftHandY - bodyY) * slide)
        p.rotate(angle)
        p.pop()

        this.drawKeypoints()
        this.drawSkeleton()

        p.strokeWeight(4)
        p.stroke(0, 0, 255)
        p.line(leftWristX, leftWristY, leftHandX, leftHandY)
        p.line(rightWristX, rightWristY, rightHandX, rightHandY)
        p.fill(0, 0, 255)
        p.noStroke()
        p.ellipse(leftHandX, leftHandY, 10, 10)
        p.ellipse(rightHandX, rightHandY, 10, 10)
      }
    }

    this.p5 = new p5js(sketch)
  },
  methods: {
    getText(): string {
      return this.text
    },
    modelLoaded() {
      console.log("Model Loaded!")
    },
    gotPoses(results?: any) {
      this.poses = results
      if (this.poses.length > 0) {
        const newLeftShoulderX = this.poses[0].pose.leftShoulder.x
        const newLeftShoulderY = this.poses[0].pose.leftShoulder.y

        const newRightShoulderX = this.poses[0].pose.rightShoulder.x
        const newRightShoulderY = this.poses[0].pose.rightShoulder.y

        const newLeftElbowX = this.poses[0].pose.leftElbow.x
        const newLeftElbowY = this.poses[0].pose.leftElbow.y

        const newRightElbowX = this.poses[0].pose.rightElbow.x
        const newRightElbowY = this.poses[0].pose.rightElbow.y

        const newLeftWristX = this.poses[0].pose.leftWrist.x
        const newLeftWristY = this.poses[0].pose.leftWrist.y

        const newRightWristX = this.poses[0].pose.rightWrist.x
        const newRightWristY = this.poses[0].pose.rightWrist.y

        const newLeftHipX = this.poses[0].pose.leftHip.x
        const newLeftHipY = this.poses[0].pose.leftHip.y

        const newRightHipX = this.poses[0].pose.rightHip.x
        const newRightHipY = this.poses[0].pose.rightHip.y

        leftShoulderX = this.p5.lerp(leftShoulderX, newLeftShoulderX, 0.25)
        leftShoulderY = this.p5.lerp(leftShoulderY, newLeftShoulderY, 0.25)

        rightShoulderX = this.p5.lerp(rightShoulderX, newRightShoulderX, 0.25)
        rightShoulderY = this.p5.lerp(rightShoulderY, newRightShoulderY, 0.25)

        leftElbowX = this.p5.lerp(leftElbowX, newLeftElbowX, 0.25)
        leftElbowY = this.p5.lerp(leftElbowY, newLeftElbowY, 0.25)

        rightElbowX = this.p5.lerp(rightElbowX, newRightElbowX, 0.25)
        rightElbowY = this.p5.lerp(rightElbowY, newRightElbowY, 0.25)

        leftWristX = this.p5.lerp(leftWristX, newLeftWristX, 0.25)
        leftWristY = this.p5.lerp(leftWristY, newLeftWristY, 0.25)

        rightWristX = this.p5.lerp(rightWristX, newRightWristX, 0.25)
        rightWristY = this.p5.lerp(rightWristY, newRightWristY, 0.25)

        leftHipX = this.p5.lerp(leftHipX, newLeftHipX, 0.25)
        leftHipY = this.p5.lerp(leftHipY, newLeftHipY, 0.25)

        rightHipX = this.p5.lerp(rightHipX, newRightHipX, 0.25)
        rightHipY = this.p5.lerp(rightHipY, newRightHipY, 0.25)
      }
    },
    drawKeypoints() {
      for (let i = 0; i < this.poses.length; i++) {
        const pose = this.poses[i].pose

        for (let j = 0; j < pose.keypoints.length; j++) {
          const keypoint = pose.keypoints[j]
          if (keypoint.score > 0.2) {
            this.p5.strokeWeight(4)
            this.p5.fill(255, 0, 0)
            this.p5.noStroke()
            this.p5.ellipse(keypoint.position.x, keypoint.position.y, 10, 10)
          }
        }
      }
    },
    drawSkeleton() {
      // Loop through all the skeletons detected
      for (let i = 0; i < this.poses.length; i++) {
        const skeleton = this.poses[i].skeleton
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
          const partA = skeleton[j][0]
          const partB = skeleton[j][1]
          this.p5.stroke(255, 0, 0)
          this.p5.line(
            partA.position.x,
            partA.position.y,
            partB.position.x,
            partB.position.y
          )
        }
      }
    }
  }
})
