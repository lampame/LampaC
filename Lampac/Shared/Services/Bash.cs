using System.Diagnostics;

namespace Shared.Services;

public static class Bash
{
    public static bool Comand(string comand)
    {
        try
        {
            var processInfo = new ProcessStartInfo();
            processInfo.UseShellExecute = false;
            processInfo.RedirectStandardOutput = true;
            processInfo.FileName = "/bin/bash";
            processInfo.ArgumentList.Add("-c");
            processInfo.ArgumentList.Add(comand);

            var process = Process.Start(processInfo);
            if (process == null)
                return false;

            return true;
        }
        catch
        {
            return false;
        }
    }

    async public static Task<string> ComandAsync(string comand)
    {
        try
        {
            var processInfo = new ProcessStartInfo();
            processInfo.UseShellExecute = false;
            processInfo.RedirectStandardError = true;
            processInfo.RedirectStandardOutput = true;
            processInfo.FileName = "/bin/bash";
            processInfo.ArgumentList.Add("-c");
            processInfo.ArgumentList.Add(comand);

            var process = Process.Start(processInfo);
            if (process == null)
                return null;

            Task<string> outputTask = process.StandardOutput.ReadToEndAsync();
            Task<string> errorTask = process.StandardError.ReadToEndAsync();

            await Task.WhenAll(outputTask, errorTask).ConfigureAwait(false);
            await process.WaitForExitAsync().ConfigureAwait(false);

            return outputTask.Result + errorTask.Result;
        }
        catch
        {
            return null;
        }
    }
}
