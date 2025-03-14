<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Cache;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class QueuedVerifyEmail extends VerifyEmail implements ShouldQueue
{
    use Queueable;
    public function __construct()
    {

    }
    public function via($notifiable)
    {
        return ['mail'];
    }
    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);
     
        $otp = rand(100000, 999999);
        Cache::put('email_otp_' . $notifiable->id, $otp, now()->addMinutes(10));

        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Here is your OTP: ' . $otp)
            ->line('Or click the button below to verify your email:')
            ->action('Verify Email', $verificationUrl)
            ->line('Do not share this OTP with anyone!');
    }
}
