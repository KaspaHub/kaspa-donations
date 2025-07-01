$(document).ready(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (!tabs[0]?.url?.startsWith("http")) {
                $('#donation-info').html('<p>This extension works on standard web pages (HTTP/HTTPS) only.</p>');
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getKaspaMetaTags
        }).then(results => {
            if (!results?.[0]?.result?.kaspaWallet) {
                $('#donation-info').html('<p>This website doesn\'t accept Kaspa donations yet.</p><p>Check back later or let the owner know about it!</p>');
                return;
            }

            if (!/^kaspa:[a-zA-Z0-9]{50,72}$/.test(results[0].result.kaspaWallet)) {
                $('#donation-info').html('<p>The Kaspa address found on this page is not in a valid format. Please inform the website owner.</p>');
                return;
            }

            $('#kaspa-address').text(results[0].result.kaspaWallet);
            $('#qr-code-display').data('qrcodeval', results[0].result.kaspaWallet);

            $('#receiver-text').text(results[0].result.kaspaTitle || (() => {
                try {
                    return `${new URL(tabs[0].url).hostname} is accepting donations!`;
                } catch (e) {
                    // console.error("Could not parse URL for domain name:", e);
                    return 'This website is accepting contributions.';
                }
            })());

            $(".qrCode").each(function() {
                $(this).qrcode({
                    render: 'image',
                    size: 256,
                    crisp: true,
                    text: $(this).data('qrcodeval'),
                    quiet: 3,
                });
                $(this).find('img').addClass('customClass').attr('viewable', 'true');
            });

            $('#copy-button').on('click', function() {
                navigator.clipboard.writeText(results[0].result.kaspaWallet).then(() => {
                    let originalText = $(this).text();
                    $(this).text('Copied!');
                    setTimeout(() => $(this).text(originalText), 1500);
                }).catch(err => {
                    console.error('Failed to copy address: ', err);
                });
            });

        }).catch(error => {
            // console.error("Error executing script:", error);
            $('#donation-info').html('<p>This webpage is not supported.</p>');
        });
    });
});

function getKaspaMetaTags() {
    return {
        kaspaWallet: document.querySelector('head meta[name="kaspa:wallet"]')?.content,
        kaspaTitle: document.querySelector('head meta[name="kaspa:title"]')?.content
    };
}