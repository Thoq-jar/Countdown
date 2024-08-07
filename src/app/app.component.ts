import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NgOptimizedImage],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Countdown";
  countdown: string = "Timer not started!";
  countdownInterval: any;

  async setNotification(inputValue: string) {
    const inputDateTime = new Date(inputValue);

    const permission = await requestNotificationPermission();
    if (permission === "granted" && !isNaN(inputDateTime.getTime())) {
      this.startCountdown(inputDateTime);
    } else {
      alert(
        "Notification permission was not granted or an error occurred while parsing the input date!"
      );
    }
  }

  showNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else {
      alert(
        "Notification permission not granted which are required to use countdown!"
      );
    }
  }

  startCountdown(inputDateTime: Date) {
    this.countdownInterval = setInterval(() => {
      const now = new Date();
      const timeDiff = inputDateTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        this.countdown = "Event has started!";
        this.deliverNotification(
          "Countdown",
          "Countdown for event has ended!"
        ).then((_) => {});
        clearInterval(this.countdownInterval);
      } else {
        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);

        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }

  async deliverNotification(title: string, body: string) {
    const permission = await requestNotificationPermission();

    if (permission === "granted") {
      this.showNotification(title, { body: body });
    } else {
      alert(
        "Notification permission not granted which are required to use countdown!"
      );
    }
  }
}

function requestNotificationPermission(): Promise<NotificationPermission> {
  return new Promise((resolve) => {
    if (Notification.permission === "granted") {
      resolve("granted");
    } else if (Notification.permission === "denied") {
      resolve("denied");
    } else {
      Notification.requestPermission().then((permission) => {
        resolve(permission);
      });
    }
  });
}